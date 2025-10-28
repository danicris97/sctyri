<?php

namespace App\Enums;

enum AgreementStatusEnum: string
{
    case Activo = 'Activo';
    case Próximo_a_vencer = 'Próximo a vencer';
    case Vencido = 'Vencido';
    case Renovado = 'Renovado';
    case Cancelado = 'Cancelado';

    public function label(): string
    {
        return match($this) {
            self::Activo => 'Activo',
            self::Próximo_a_vencer => 'Próximo a vencer',
            self::Vencido => 'Vencido',
            self::Renovado => 'Renovado',
            self::Cancelado => 'Cancelado',
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
