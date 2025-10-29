export interface Country {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface Province {
    id: number;
    country_id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface Locality {
    id: number;
    province_id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}