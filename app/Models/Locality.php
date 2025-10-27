<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Locality extends Model
{
    /** @use HasFactory<\Database\Factories\LocalityFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'province_id',
    ];

    /**
     * Relacion 
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }

    public function dependencies(): HasMany
    {
        return $this->hasMany(Dependency::class);
    }

    /*
    * Relacion indirecta al pais
    */
    public function country(): BelongsTo
    {
        return $this->province()->with('country');
    }

    /**
     * Scopes
     */
    public function scopeForProvince($query, $provinceId)
    {
        return $query->where('province_id', $provinceId);
    }

    public function scopeForCountry($query, $countryId)
    {
        return $query->whereHas('province', function ($q) use ($countryId) {
            $q->where('country_id', $countryId);
        });
    }

    /**
     * Accessors
     */
    public static function getOptions($provinceId = null)
    {
        $query = self::with(['province.country'])->orderBy('name');
        
        if ($provinceId) {
            $query->forProvince($provinceId);
        }
        
        return $query->get()->map(function ($locality) {
            return [
                'value' => $locality->id,
                'label' => $locality->name,
                'province_id' => $locality->province_id,
                'province_name' => $locality->province->name ?? null,
                'country_id' => $locality->province->country_id ?? null,
                'country_name' => $locality->province->country->name ?? null,
            ];
        });
    }

    /**
     * Obtiene la jerarquía completa (país -> provincia -> localidad)
     */
    public function getCompleteHierarchy()
    {
        $this->load(['province.country']);
        
        return [
            'country' => [
                'id' => $this->province->country->id,
                'name' => $this->province->country->name,
            ],
            'province' => [
                'id' => $this->province->id,
                'name' => $this->province->name,
            ],
            'locality' => [
                'id' => $this->id,
                'name' => $this->name,
            ],
        ];
    }
}
