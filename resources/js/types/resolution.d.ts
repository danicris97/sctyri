
export type ResolutionType = 'AU' | 'CS' | 'DR' | 'CDEX' | 'IEM' | 'DEX' | 'CDNAT' | 'DNAT' | 'CDECO' | 'DECO' | 'CDSALUD' | 'DSALUD' | 'CDH' | 'DH' | 'CDING' | 'DING' | 'CDFRO' | 'DFRO' | 'SRO' | 'CDFRMT' | 'DFRMT' | 'SRTCA' | 'IEMT' | 'SRMRF' | 'CCI' | 'CI';

export interface Resolution {
    id: number;
    number: string;
    date: Date;
    type: ResolutionType | null;
    matter: string | null;
    link: string | null;
    file_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_date: string;
    name: string;
    year: number;
}