<?php

namespace App\Enums;

enum FileEnum: string
{
    case Presentacion = 'Presentacion';
    case Proyecto = 'Proyecto';
    case Prestacion = 'Prestacion';
    case Solicitud = 'Solicitud';
    case Convenio = 'Convenio';
    case PPS = 'PPS';
    case Propuesta = 'Propuesta';
    case Resolucion = 'Resolucion';
    case Comodato = 'Comodato';
    case Servicio_Tecnico_Repetitivo = 'Servicio Tecnico Repetitivo';
    case Beca_de_Formacion = 'Beca de Formacion';
    case Informe = 'Informe';
    case Auspicio = 'Auspicio';
    case Invitacion = 'Invitacion';
    case Mision = 'Mision';
    case Notificacion = 'Notificacion';
    case Orden = 'Orden';
    case Vinculacion_Tecnologica = 'Vinculacion Tecnologica';
    case Pago_de_Estipendios = 'Pago de Estipendios';
    case Intercambio = 'Intercambio';
    case Compras = 'Compras';
    case Licitacion = 'Licitacion';
    case Reconocimiento_Materias = 'Reconocimiento de Materias';
    case Contrato = 'Contrato';
    case Designacion = 'Designacion';
    case Otro = 'Otro';

    public function label(): string
    {
        return match($this) {
            self::Presentacion => 'Presentacion',
            self::Proyecto => 'Proyecto',
            self::Prestacion => 'Prestacion',
            self::Solicitud => 'Solicitud',
            self::Convenio => 'Convenio',
            self::PPS => 'PPS',
            self::Propuesta => 'Propuesta',
            self::Resolucion => 'Resolucion',
            self::Comodato => 'Comodato',
            self::Servicio_Tecnico_Repetitivo => 'Servicio Tecnico Repetitivo',
            self::Beca_de_Formacion => 'Beca de Formacion',
            self::Informe => 'Informe',
            self::Auspicio => 'Auspicio',
            self::Invitacion => 'Invitacion',
            self::Mision => 'Mision',
            self::Notificacion => 'Notificacion',
            self::Orden => 'Orden',
            self::Vinculacion_Tecnologica => 'Vinculacion Tecnologica',
            self::Pago_de_Estipendios => 'Pago de Estipendios',
            self::Intercambio => 'Intercambio de Alumnos/Profesores/No-Docentes',
            self::Compras => 'Compras',
            self::Licitacion => 'Licitacion',
            self::Reconocimiento_Materias => 'Reconocimiento de Materias',
            self::Contrato => 'Contrato',
            self::Designacion => 'Designacion',
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
