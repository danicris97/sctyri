<?php

namespace App\Enums;

enum InstitutionEnum: string
{
    case Agencia = 'Agencia';
    case Agremiacion = 'Agremiacion';
    case Asociacion = 'Asociacion';
    case Consejo = 'Consejo';
    case Deportiva = 'Deportiva';
    case Educativa = 'Educativa';
    case Empresa = 'Empresa';
    case Ente = 'Ente';
    case Fundacion = 'Fundacion';
    case Gobierno = 'Gobierno'; // gobiernos tipo gobierno de salta, cordoba, tarija, etc...
    case Gubernamental = 'Gubernamental'; // institutos, dependencias gubernamentales por ejemplo ministerios, secretarias, etc
    case Instituto = 'Instituto';
    case Nacion = 'Nacion'; // gobierno nacional, incluye ministerios nacionales, secretarias, etc
    case Municipal = 'Municipal'; // dependencias municiapales se incluye a la propia municipalidad por ejemplo municipalidad de salta y secretaria de deportes de la municipalidad de salta
    case Medica = 'Medica'; // institutos medicos por ejemplo hospital de cordoba, hospital san bernardo, sanatorios, etc
    case Sindical = 'Sindical';
    case ONG = 'ONG';
    case Universitaria = 'Universitaria'; //incluye institutos y propias universidades por ejemplo universidad de cordoba, universidad de chile, etc
    case Otro = 'Otro';

    public function label(): string
    {
        return match($this) {
            self::Agencia => 'Agencia',
            self::Agremiacion => 'Agremiacion',
            self::Asociacion => 'Asociacion',
            self::Consejo => 'Consejo',
            self::Deportiva => 'Deportiva',
            self::Educativa => 'Educativa',
            self::Empresa => 'Empresa',
            self::Ente => 'Ente',
            self::Fundacion => 'Fundacion',
            self::Gobierno => 'Gobierno',
            self::Gubernamental => 'Gubernamental',
            self::Instituto => 'Instituto',
            self::Nacion => 'Nacion',
            self::Municipal => 'Municipal',
            self::Medica => 'Medica',
            self::Sindical => 'Sindical',
            self::ONG => 'ONG',
            self::Universitaria => 'Universitaria',
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