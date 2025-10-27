<?php

namespace App\Enums;

enum ResolutionEnum: string
{
    case Asamblea_Universitaria = 'AU';
    case Consejo_Superior = 'CS';
    case Rectorado = 'DR';
    case Consejo_Directivo_Exactas = 'CDEX';
    case IEM = 'IEM';
    case Decanato_Exactas = 'DEX';
    case Consejo_Directivo_Naturales = 'CDNAT';
    case Decanato_Naturales = 'DNAT';
    case Consejo_Directivo_Economicas = 'CDECO';
    case Decanato_Economicas = 'DECO';
    case Consejo_Directivo_Salud = 'CDSALUD';
    case Decanato_Salud = 'DSALUD';
    case Consejo_Directivo_Humanidades = 'CDH';
    case Decanato_Humanidades = 'DH';
    case Consejo_Directivo_Ingenieria = 'CDING';
    case Decanato_Ingenieria = 'DING';
    case Consejo_Directivo_Facultad_Regional_Oran = 'CDFRO';
    case Decanato_Facultad_Regional_Oran = 'DFRO';
    case Sede_Regional_Oran = 'SRO';
    case Consejo_Directivo_Facultad_Regional_Multidisciplinar_Tartagal = 'CDFRMT';
    case Facultad_Regional_Multidisciplinar_Tartagal = 'DFRMT';
    case Consejo_Asesor_Sede_Regional_Tartagal = 'SRTCA';
    case IEM_Tartagal = 'IEMT';
    case Sede_Regional_Metan_Rosario_de_la_Frontera = 'SRMRF';
    case Consejo_de_Investigacion = 'CCI';
    case Presidencia_CIUNSa = 'CI';

    public function label(): string
    {
        return match($this) {
            self::Asamblea_Universitaria => 'AU - Asamblea Universitaria',
            self::Consejo_Superior => 'CS - Consejo Superior',
            self::Rectorado => 'DR - Despacho del Rectorado',
            self::Consejo_Directivo_Exactas => 'CDEX - Consejo Directivo Exactas',
            self::IEM => 'IEM - Instituto de Educación Media',
            self::Decanato_Exactas => 'DEX - Decanato Exactas',
            self::Consejo_Directivo_Naturales => 'CDNAT - Consejo Directivo Naturales',
            self::Decanato_Naturales => 'DNAT - Decanato Naturales',
            self::Consejo_Directivo_Economicas => 'CDECO - Consejo Directivo Económicas',
            self::Decanato_Economicas => 'DECO - Decanato Económicas',
            self::Consejo_Directivo_Salud => 'CDSALUD - Consejo Directivo Salud',
            self::Decanato_Salud => 'DSALUD - Decanato Salud',
            self::Consejo_Directivo_Humanidades => 'CDH - Consejo Directivo Humanidades',
            self::Decanato_Humanidades => 'DH - Decanato Humanidades',
            self::Consejo_Directivo_Ingenieria => 'CDING - Consejo Directivo Ingeniería',
            self::Decanato_Ingenieria => 'DING - Decanato Ingeniería',
            self::Consejo_Directivo_Facultad_Regional_Oran => 'CDFRO - Consejo Directivo Facultad Regional Orán',
            self::Decanato_Facultad_Regional_Oran => 'DFRO - Decanato Facultad Regional Orán',
            self::Sede_Regional_Oran => 'SRO - Sede Regional Orán',
            self::Consejo_Directivo_Facultad_Regional_Multidisciplinar_Tartagal => 'CDFRMT - Consejo Directivo Facultad Regional Multidisciplinar Tartagal',
            self::Facultad_Regional_Multidisciplinar_Tartagal => 'FRMT - Facultad Regional Multidisciplinar Tartagal',
            self::Consejo_Asesor_Sede_Regional_Tartagal => 'CASRT - Consejo Asesor Sede Regional Tartagal',
            self::IEM_Tartagal => 'IEM Tartagal',
            self::Sede_Regional_Metan_Rosario_de_la_Frontera => 'SRMRF - Sede Regional Metán - Rosario de la Frontera',
            self::Consejo_de_Investigacion => 'CCI - Consejo de Investigación',
            self::Presidencia_CIUNSa => 'CI - Presidencia CIUNSa',
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