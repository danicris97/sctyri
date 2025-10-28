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
     * Scopes
     */
    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        $query->where(function ($q) use ($search) {
            $q->whereHas('person', function ($subQ) use ($search) {
                $subQ->where('name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%")
                    ->orWhere('dni', 'like', "%{$search}%");
            })->orWhere('position', 'like', "%{$search}%");
        });
    }

    public function scopeFilter($query, $filters)
    {
        if ($request->filled('position')) {
            $query->where('position', 'like', '%' . $request->position . '%');
        }

        if ($request->filled('active')) {
            $query->where('active', (bool) $request->active);
        }
    }

    public function scopeOrdered($query, $sort, $direction)
    {
        if (in_array($sort, ['name', 'surname', 'dni'], true)) {
            $query->orderBy(
                Person::select($sort)
                    ->whereColumn('person.id', 'person_positions.person_id'),
                    $direction
            );
        } else {
            $query->orderBy($sort, $direction);
        }
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
