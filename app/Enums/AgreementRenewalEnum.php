<?php

namespace App\Enums;

enum AgreementRenewalEnum: string
{
    case Partes_Iguales = 'Partes Iguales';
    case Escalera = 'Escalera';
    case Unica = 'Unica';
    case Unica_Mitad_Periodo = 'Unica Mitad Periodo';
    case Unica_Anual = 'Unica Anual';
    case Anual = 'Anual';
    case Sin_Renovacion = 'Sin Renovacion';
    case Renovable_de_Comun_Acuerdo = 'Renovable de Comun Acuerdo';
    case Permanente = 'Permanente';

    public function label(): string
    {
        return match($this) {
            self::Partes_Iguales => 'Partes Iguales',
            self::Escalera => 'Escalera',
            self::Unica => 'Unica',
            self::Unica_Mitad_Periodo => 'Mitad Periodo',
            self::Unica_Anual => 'Unica Anual',
            self::Anual => 'Anual',
            self::Renovable_de_Comun_Acuerdo => 'Renovable de Comun Acuerdo',
            self::Sin_Renovacion => 'Sin Renovacion',
            self::Permanente => 'Permanente',
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
