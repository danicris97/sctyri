<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    /** @use HasFactory<\Database\Factories\CountryFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    /**
     * Relaciones
     */
    public function provinces(): HasMany
    {
        return $this->hasMany(Province::class);
    }

    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }

    public function persons(): HasMany
    {
        return $this->hasMany(Person::class);
    }

    /**
     * Scopes
     */
    /*
    public function scopeActive($query)
    {
        return $query; // Por si más adelante agregas campo activo
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }
    */

    /**
     * Obtiene las opciones para un select
     */
    public static function getOptions()
    {
        return self::ordered()->get()->map(function ($country) {
            return [
                'value' => $country->id,
                'label' => $country->name,
            ];
        });
    }
}
