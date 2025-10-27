<?php

namespace App\Enums;

enum DependencyEnum: string
{
    case Rectorado = 'Rectorado';
    case Vicerrectorado = 'Vicerrectorado';
    case Despacho = 'Despacho';
    case Secretaria = 'Secretaria';
    case Coordinacion = 'Coordinacion';
    case Centro = 'Centro';
    case Decanato = 'Decanato';
    case Vicedecanato = 'Vicedecanato';
    case Departamento = 'Departamento';
    case Facultad = 'Facultad';
    case Instituto = 'Instituto';
    case Sede_Regional = 'Sede_Regional';
    case Consejo = 'Consejo';
    case Direccion = 'Direccion';
    case Oficina = 'Oficina';
    case Comunicacion = 'Comunicacion';
    case Biblioteca = 'Biblioteca';
    case Informatica = 'Informatica';
    case Asesoria = 'Asesoria';
    case Museo = 'Museo';
    case Universidad = 'Universidad';
    case Otro = 'Otro';

    public function label(): string
    {
        return match($this) {
            self::Rectorado => 'Rectorado',
            self::Vicerrectorado => 'Vicerrectorado',
            self::Despacho => 'Despacho',
            self::Secretaria => 'Secretaría',
            self::Coordinacion => 'Coordinación',
            self::Centro => 'Centro',
            self::Decanato => 'Decanato',
            self::Vicedecanato => 'Vicedecanato',
            self::Departamento => 'Departamento',
            self::Facultad => 'Facultad',
            self::Instituto => 'Instituto',
            self::Sede_Regional => 'Sede Regional',
            self::Consejo => 'Consejo',
            self::Direccion => 'Direccion',
            self::Oficina => 'Oficina',
            self::Comunicacion => 'Comunicacion',
            self::Biblioteca => 'Biblioteca',
            self::Informatica => 'Informatica',
            self::Asesoria => 'Asesoria',
            self::Museo => 'Museo',
            self::Otro => 'Otro',
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
