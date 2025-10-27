<?php

namespace App\Enums;

enum AgreementEnum: string
{
    /* Convenios */
    case Marco = 'Marco';
    case Adhesion = 'Adhesion';
    case Colaboracion = 'Colaboracion';
    case Cooperacion = 'Cooperacion';
    case Comision_de_Estudio = 'Comision de Estudio';
    case Especifico = 'Especifico';
    case Investigacion = 'Investigacion';
    case Intercambio = 'Intercambio';
    case Pasantia = 'Pasantia';
    case PPS = 'PPS';
    case Proyecto = 'Proyecto';
    case Prestacion_Servicio = 'Prestacion de Servicio';
    case Subvencion = 'Subvencion';
    case Vinculacion_Tecnologica = 'Vinculación Tecnologica';

    /* Actas */
    case Acta_Acuerdo = 'Acta Acuerdo';
    case Acta_Complemento = 'Acta Complemento';
    case Acta_Compromiso = 'Acta Compromiso';
    case Acta_Especifica = 'Acta Especifica';

    /* Acuerdos */
    case Acuerdo = 'Acuerdo';
    case Acuerdo_Complementario = 'Acuerdo Complementario';
    case Acuerdo_Cooperacion = 'Acuerdo Cooperacion';
    case Acuerdo_Especifico = 'Acuerdo Especifico';
    case Acuerdo_Investigacion = 'Acuerdo Investigacion';

    /* Otros tipós */
    case Adenda = 'Adenda';
    case Anexo = 'Anexo';
    case Carta_Intencion = 'Carta Intencion';
    case Memorandum = 'Memorandum';

    /* Protocolos */
    case Protocolo = 'Protocolo';
    case Protocolo_Adicional = 'Protocolo Adicional';
    case Protocolo_de_Colaboracion = 'Protocolo de Colaboracion';
    case Protocolo_Especifico = 'Protocolo Especifico';
    case Protocolo_de_Investigacion = 'Protocolo de Investigacion';

    /* Otros */
    case Otro = 'Otro';

    public function label(): string
    {
        return match($this) {
            self::Marco => 'Marco',
            self::Adhesion => 'Adhesion',
            self::Colaboracion => 'Colaboracion',
            self::Cooperacion => 'Cooperacion',
            self::Comision_de_Estudio => 'Comision de Estudio',
            self::Especifico => 'Especifico',
            self::Investigacion => 'Investigacion',
            self::Intercambio => 'Intercambio de Alumnos/Profesores/No-Docentes',
            self::Pasantia => 'Pasantia',
            self::PPS => 'PPS',
            self::Proyecto => 'Proyecto',
            self::Prestacion_Servicio => 'Prestacion de Servicio',
            self::Subvencion => 'Subvencion',
            self::Vinculacion_Tecnologica => 'Vinculacion Tecnologica',
            self::Acta_Acuerdo => 'Acta Acuerdo',
            self::Acta_Complemento => 'Acta Complemento',
            self::Acta_Compromiso => 'Acta Compromiso',
            self::Acta_Especifica => 'Acta Especifica',
            self::Acuerdo => 'Acuerdo',
            self::Acuerdo_Complementario => 'Acuerdo Complementario',
            self::Acuerdo_Cooperacion => 'Acuerdo Cooperacion',
            self::Acuerdo_Especifico => 'Acuerdo Especifico',
            self::Acuerdo_Investigacion => 'Acuerdo Investigacion',
            self::Adenda => 'Adenda',
            self::Anexo => 'Anexo',
            self::Carta_Intencion => 'Carta Intencion',
            self::Memorandum => 'Memorandum',
            self::Protocolo => 'Protocolo',
            self::Protocolo_Adicional => 'Protocolo Adicional',
            self::Protocolo_de_Colaboracion => 'Protocolo de Colaboracion',
            self::Protocolo_Especifico => 'Protocolo Especifico',
            self::Protocolo_de_Investigacion => 'Protocolo de Investigacion',
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
