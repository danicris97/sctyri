<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\ResolutionEnum;
use Carbon\Carbon;

class Resolution extends Model
{
    /** @use HasFactory<\Database\Factories\ResolutionFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'number',
        'date',
        'type',
        'matter',
        'link',
        'file_id',
    ];

    protected $casts = [
        'date' => 'date',
        'type' => ResolutionEnum::class,
    ];

    protected $appends = [
        'formated_date',
        'name',
        'year',
    ];

    protected static function booted()
    {
        static::saving(function ($model) {
            if (is_null($model->number)) {
                return;
            }

            // Aseguramos string, limpiamos espacios y dejamos solo dígitos
            $num = preg_replace('/\D/', '', trim((string) $model->number));

            // Si quedó vacío, guardamos null
            if ($num === '') {
                $model->number = null;
                return;
            }

            // Completar con ceros a la izquierda si tiene < 4 dígitos
            if (strlen($num) < 4) {
                $num = str_pad($num, 4, '0', STR_PAD_LEFT);
            }

            // Si tiene 4 o más, lo dejamos tal cual
            $model->number = $num;
        });
    }

    /**
     * Scopes
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('number', 'like', "%{$search}%")
                     ->orWhere('type', 'like', "%{$search}%")
                     ->orWhereHas('file', function($q) use ($search) {
                        $q->where('number', 'like', "%{$search}%");
                    });
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['type'])) {
            $query->where('type', 'like', "%{$filters['type']}%");
        }

        if (!empty($filters['file_id'])) {
            $query->where('file_id', $filters['file_id']);
        }
        
        if (!empty($filters['date_since']) && !empty($filters['date_until'])) {
            $query->whereBetween('date', [$filters['date_since'], $filters['date_until']]);
        } elseif (!empty($filters['date_since'])) {
            $query->whereBetween('date', [$filters['date_since'], now()]);
        } elseif (!empty($filters['date_until'])) {
            $query->whereBetween('date', ['1900-01-01', $filters['date_until']]);
        }
    }

    /**
     * Relaciones
     */
    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class);
    }

    public function agreementCancellations()
    {
        return $this->hasMany(AgreementCancellation::class);
    }

    public function agreementRenewals()
    {
        return $this->hasMany(AgreementRenewal::class);
    }

    //helper
    public static function getOptions()
    {
        return self::all()->map(function ($resolution) {
            return [
                'value' => $resolution->id,
                'label' => $resolution->name,
            ];
        });
    }

    /**
     * Accesors
     */
    public function getformatedDateAttribute(): ?string
    {
        return $this->date ? $this->date->format('d/m/Y') : null;
    }

    public function getNameAttribute(): ?string
    {
        if (!$this->number || !$this->date) return null;

        $type = $this->type instanceof ResolutionEnum ? $this->type->value : (string)$this->type;

        return 'RESOLUCIÓN-'.$type.'-'.$this->number.'-'.$this->date->year;
    }

    public function getYearAttribute($date): ?int
    {
        return $date ? Carbon::parse($date)->year : null;
    }
}
