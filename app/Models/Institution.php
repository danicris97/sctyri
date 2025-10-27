<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\InstitutionEnum;

class Institution extends Model
{
    /** @use HasFactory<\Database\Factories\InstitutionsFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'cuit',
        'country_id',
        'province_id',
        'locality_id',
        'address',
        'phone',
        'email',
        'web',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'type' => InstitutionEnum::class,
    ];

    /**
     * Relations
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function locality()
    {
        return $this->belongsTo(Locality::class);
    }

    public function agreements()
    {
        return $this->belongsToMany(Agreement::class, 'agreement_institution');
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'causative');
    }

    /**
     * Scopes
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('cuit', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('country_id', 'like', "%{$search}%")
                    ->orWhere('province_id', 'like', "%{$search}%")
                    ->orWhere('locality_id', 'like', "%{$search}%");
            });
        }
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['type'])) {
            $query->where('type', 'like', "%{$filters['type']}%");
        }

        if (!empty($filters['locality'])) {
            $query->where('locality_id', $filters['locality']);
        }

        if (!empty($filters['province'])) {
            $query->where('province_id', $filters['province']);
        }

        if (!empty($filters['country'])) {
            $query->where('country_id', $filters['country']);
        }
    }

    public function scopeWithActiveAgreement($query)
    {
        return $query->whereHas('agreements', function($q) {
            $q->whereDate('date_end', '>=', today())
                ->orWhereHas('renewals', function($r) {
                    $r->whereDate('end_date', '>=', today());
                });
        });
    }

    // Scope mejorado para instituciones internacionales
    public function scopeInternational($query)
    {
        return $query->whereHas('locality.province.country', function($q) {
            $q->where('name', '!=', 'Argentina');
        });
    }

    // Scope adicional para instituciones nacionales (útil para casos contrarios)
    public function scopeNational($query)
    {
        return $query->whereHas('locality.province.country', function($q) {
            $q->where('name', 'Argentina');
        });
    }

    // Scope para filtrar por país específico
    public function scopeForCountry($query, $country)
    {
        return $query->whereHas('locality.province.country', function($q) use ($country) {
            $q->where('name', $country);
        });
    }

    /**
     * Accessors y Helpers
     */
    public static function getOptions()
    {
        return self::all()->map(function ($institution) {
            return [
                'value' => $institution->id,
                'label' => $institution->name,
            ];
        });
    }
}
