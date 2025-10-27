<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\personPositionEnum;

class PersonPosition extends Model
{
    /** @use HasFactory<\Database\Factories\PersonPositionFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'person_id',
        'position',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'position' => PersonPositionEnum::class,
    ];

    /**
     * Relaciones
     */

    public function person()
    {
        return $this->belongsTo(Person::class);
    }

    public function agreements()
    {
        return $this->belongsToMany(Agreement::class, 'agreement_people');
    }

    /**
     * Funciones estaticas
     */
    public static function getOptions()
    {
        return self::all()->map(function ($personPosition) {
            $label = $personPosition->person->name . ' ' . $personPosition->person->surname;
            if ($personPosition->person->dni) {
                $label .= ' - ' . $personPosition->person->dni . ' ' . $personPosition->position->label();
            }

            return [
                'value' => $personPosition->id,
                'label' => $label,
            ];
        });
    }

    public static function getOptionsStudent()
    {
        return self::where('position', PersonPositionEnum::Alumno)->get()->map(function ($personPosition) {
            $label = $personPosition->person->name . ' ' . $personPosition->person->surname;
            if ($personPosition->person->dni) {
                $label .= ' - ' . $personPosition->person->dni;
            }

            return [
                'value' => $personPosition->id,
                'label' => $label,
            ];
        });
    }

    public static function getOptionsNoStudent()
    {
        return self::where('position', '!=', PersonPositionEnum::Alumno)->get()->map(function ($personPosition) {
            $label = $personPosition->person->name . ' ' . $personPosition->person->surname . ' - ' . $personPosition->position->value;
            if ($personPosition->person->dni) {
                $label .= ' - ' . $personPosition->person->dni;
            }

            return [
                'value' => $personPosition->id,
                'label' => $label,
            ];
        });
    }

    public static function getOptionsTeacher()
    {
        return self::where('position', PersonPositionEnum::Docente)->get()->map(function ($personPosition) {
            $label = $personPosition->person->name . ' ' . $personPosition->person->surname . ' - ' . $personPosition->position->value;
            if ($personPosition->person->dni) {
                $label .= ' - ' . $personPosition->person->dni;
            }

            return [
                'value' => $personPosition->id,
                'label' => $label,
            ];
        });
    }

    public static function geOptionsExternal()
    {
        return self::where('position', PersonPositionEnum::Externo)->get()->map(function ($personPosition) {
            $label = $personPosition->person->name . ' ' . $personPosition->person->surname . ' - ' . $personPosition->position->value;
            if ($personPosition->person->dni) {
                $label .= ' - ' . $personPosition->person->dni;
            }

            return [
                'value' => $personPosition->id,
                'label' => $label,
            ];
        });
    }
}
