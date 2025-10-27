<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Person extends Model
{
    /** @use HasFactory<\Database\Factories\PersonFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'surname',
        'dni',
        'email',
        'phone',
        'address',
        'nationality',
    ];

    /**
     * Relaciones
     */

    public function country()
    {
        return $this->belongsTo(Country::class, 'nationality');
    }

    public function personPositions()
    {
        return $this->hasMany(PersonPosition::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'causative');
    }

    /**
     * Métodos estáticos
     */
    public static function getOptions()
    {
        return self::all()->map(function ($person) {
            $label = $person->surname . ', ' . $person->name;
            if ($person->dni) {
                $label .= ' - ' . $person->dni;
            }

            return [
                'value' => $person->id,
                'label' => $label,
            ];
        });
    }

    public static function getOptionsDni()
    {
        return self::whereNotNull('dni')
            ->get()
            ->map(function ($person) {
                return [
                    'value' => $person->id,
                    'label' => "{$person->dni} - {$person->surname}, {$person->name}",
                ];
            })
            ->values() // Reindexar para evitar objetos
            ->toArray(); // Convertir a array
    }
}
