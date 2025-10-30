export type DependencyType = 'Rectorado' | 'Vicerrectorado' | 'Despacho' | 'Secretaria' | 'Coordinacion' | 'Centro' | 'Decanato' | 'Vicedecanato' | 'Departamento' | 'Facultad' | 'Instituto' | 'Sede_Regional' | 'Consejo' | 'Direccion' | 'Oficina' | 'Comunicacion' | 'Biblioteca' | 'Informatica' | 'Asesoria' | 'Museo' | 'Universidad' | 'Otro';

export interface Dependency {
    id: number;
    name: string;
    type: DependencyType;
    abbreviation: string | null;
    parent_dependency_id: number | null;
    locality: string | null;
    locality_id: number | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    webpage: string | null;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface DependencyFormData {
    id?: number;
    name: string;
    type: string;
    abbreviation: string | null;
    parent_dependency_id: number | null;
    locality: string | null;
    locality_id: number | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    webpage: string | null;
    active: boolean;
}