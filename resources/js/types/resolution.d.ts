
export type ResolutionType = 'AU' | 'CS' | 'DR' | 'CDEX' | 'IEM' | 'DEX' | 'CDNAT' | 'DNAT' | 'CDECO' | 'DECO' | 'CDSALUD' | 'DSALUD' | 'CDH' | 'DH' | 'CDING' | 'DING' | 'CDFRO' | 'DFRO' | 'SRO' | 'CDFRMT' | 'DFRMT' | 'SRTCA' | 'IEMT' | 'SRMRF' | 'CCI' | 'CI';

export interface Resolution {
    id: number;
    number: string;
    date: string | Date;
    type: ResolutionType | null;
    matter: string | null;
    link: string | null;
    file_id: number | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_date: string;
    name: string;
    year: number;
}

export interface ResolutionFormData {
    id?: number;
    number: string;
    date: string;
    type: string;
    matter?: string | null;
    link: string;
    file_id?: number;
}
