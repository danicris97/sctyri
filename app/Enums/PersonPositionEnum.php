<?php

namespace App\Enums;

enum PersonPositionEnum: string
{
    case Rector = 'Rector';
    case Vicerector = 'Vicerector';
    case Interventor = 'Interventor';
    case Secretario = 'Secretario';
    case Decano = 'Decano';
    case Vicedecano = 'Vicedecano';
    case Jefe_de_Seccion = 'Jefe de Sección';
    case Administrativo = 'Administrativo';
    case Responsable = 'Responsable';
    case Representante = 'Representante';
    case Investigador = 'Investigador';
    case Docente = 'Docente';
    case Alumno = 'Alumno';
    case Externo = 'Externo';
    /* agregar los que sean necesarios */

    public function label(): string
    {
        return match($this) {
            self::Rector => 'Rector/a',
            self::Vicerector => 'Vicerector/a',
            self::Interventor => 'Interventor/a',
            self::Secretario => 'Secretario/a',
            self::Decano => 'Decano/a',
            self::Vicedecano => 'Vicedecano/a',
            self::Jefe_de_Seccion => 'Jefe/a de Sección',
            self::Administrativo => 'Administrativo/a',
            self::Responsable => 'Responsable',
            self::Representante => 'Representante',
            self::Investigador => 'Investigador/a',
            self::Docente => 'Docente',
            self::Alumno => 'Alumno/a',
            self::Externo => 'Externo',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
