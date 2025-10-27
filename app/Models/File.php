<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Enums\FileEnum;

class File extends Model
{
    /** @use HasFactory<\Database\Factories\FileFactory> */
    use SoftDeletes;
    use HasUuids;

    protected $fillable = [
        'number',
        'year',
        'causative_id',
        'causative_type',
        'statement',
        'type',
        'dependency_id',
        'opening_date',
        'closing_date',
        'observations',
        'international',
    ];

    protected $casts = [
        'type' => FileEnum::class,
        'opening_date' => 'date',
        'closing_date' => 'date',
        'international' => 'boolean',
    ];

    protected $appends = [
        'causative_name',
        'name',
        'state',
        'formated_opening_date',
        'formated_closing_date',
        'last_movement_date',
        'last_movement_dependency'
    ];

    /**
     * Scopes
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('number', 'like', "%{$search}%")
                     ->orWhere('year', 'like', "%{$search}%")
                     ->orWhere('type', 'like', "%{$search}%")
                     ->orWhereHas('dependency', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['type'])) {
            $query->where('type', 'like', "%{$filters['type']}%");
        }

        if (!empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        if (!empty($filters['dependency_id'])) {
            $query->where('dependency_id', $filters['dependency_id']);
        }

        if (array_key_exists('international', $filters) && $filters['international'] !== null) {
            $val = $filters['international'];

            if (is_string($val)) {
                $v = mb_strtolower($val);
                $val = match ($v) {
                    'true', '1', 'si', 'sí' => true,
                    'false', '0', 'no' => false,
                    default => null,
                };
            }

            if ($val !== null) {
                $query->where('international', $val);
            }
        }

        if (!empty($filters['causative_dependency_id'])) {
            $query->where('causative_dependency_id', $filters['causative_id'])
                    ->where('causative_type', Dependency::class);
        }

        if (!empty($filters['causative_person_id'])) {
            $query->where('causative_person_id', $filters['causative_id'])
                    ->where('causative_type', Person::class);
        }

        if (!empty($filters['causative_institution_id'])) {
            $query->where('causative_institution_id', $filters['causative_id'])
                    ->where('causative_type', Institution::class);
        }
    }

    /**
     * Accessors
     */

    public function getRouteKeyName() : string
    {
        return 'uuid';
    }

    public function getCausativeNameAttribute(): ?string
    {
        if (!$this->relationLoaded('causative') && !$this->causative) {
            return 'No tiene causante';
        }

        $causative = $this->causative;
        $type = class_basename($this->causative_type);

        return match ($type) {
            'Dependency'  => $causative->name ?? null,
            'Institution'  => $causative->name ?? null,
            'PersonPosition' => trim(
                ($causative->surname ?? '') .
                ' ' .
                ($causative->name ?? '')
            ),
            default => 'No tiene causante',
        };
    }

    public function getNameAttribute(): ?string
    {
        return 'Expte. ' . $this->number . '/' . $this->year . '-' . ($this->dependency ? $this->dependency->abbreviation : '');
    }

    public function getStateAttribute(): ?string
    {
        if ($this->closing_date) {
            return 'Cerrado';
        }

        return 'Abierto';
    }

    public function getLastMovementDateAttribute(): ?string
    {
        $date = $this->movements()->max('date');
        return $date ? Carbon::parse($date)->format('d/m/Y') : null;
    }

    public function getLastMovementDependencyAttribute(): ?string
    {
        $mov = $this->movements()
            ->with('dependencyDestination') 
            ->latest('date') 
            ->first();

        return $mov?->dependencyDestination?->name;
    }

    public function getFormatedOpeningDateAttribute(): ?string
    {
        return $this->opening_date ? Carbon::parse($this->opening_date)->format('d/m/Y') : null;
    }

    public function getFormatedClosingDateAttribute(): ?string
    {
        return $this->closing_date ? Carbon::parse($this->closing_date)->format('d/m/Y') : null;
    }
    
    /**
     * Relations
     */
    
    public function dependency()
    {
        return $this->belongsTo(Dependencies::class);
    }

    public function resolutions()
    {
        return $this->hasMany(Resolutions::class, 'file_id');
    }

    public function movements()
    {
        return $this->hasMany(Movements::class);
    }

    //causativa relacion polimorfica

    public function causative(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Accesors
     */
    public static function getOptions()
    {
        return self::all()->map(function ($file) {
            return [
                'value' => (string) $file->id,
                'label' => $file->getNameAttribute(),
            ];
        });
    }
}
