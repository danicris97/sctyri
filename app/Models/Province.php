<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Province extends Model
{
    /** @use HasFactory<\Database\Factories\ProvinceFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'country_id',
    ];

    /**
     * Relaciones
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function localities(): HasMany
    {
        return $this->hasMany(Locality::class);
    }

    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }

    /**
     * Scopes
     */
    public function scopeForCountry($query, $country)
    {
        return $query->where('country_id', $country);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }

    /**
     * Funciones estaticas
     */
    public static function getOptions($countryId = null)
    {
        $query = self::with('country')->ordered();
        
        if ($countryId) {
            $query->forCountry($countryId);
        }
        
        return $query->get()->map(function ($province) {
            return [
                'value' => $province->id,
                'label' => $province->name . ' ,' . ($province->country->name ?? 'N/A'),
                'country_id' => $province->country_id,
            ];
        });
    }
}
