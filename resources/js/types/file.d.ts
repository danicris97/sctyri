
export type FileType = 'Presentacion' | 'Proyecto' | 'Prestacion' | 'Solicitud' | 'Convenio' | 'PPS' | 'Propuesta' | 'Resolucion' | 'Comodato' | 'Servicio Tecnico Repetitivo' | 'Beca de Formacion' | 'Informe' | 'Auspicio' | 'Invitacion' | 'Mision' | 'Notificacion' | 'Orden' | 'Vinculacion Tecnologica' | 'Pago de Estipendios' | 'Intercambio' | 'Compras' | 'Licitacion' | 'Reconocimiento de Materias' | 'Contrato' | 'Designacion' | 'Otro';

export type FileState = 'Abierto' | 'Cerrado';

export interface File {
    id: number;
    uuid: string;
    number: string;
    year: number;
    causative_id: number | null;
    causative_type: string | null;
    statement: string | null;
    type: FileType | string;
    dependency_id: number | null;
    opening_date: string | null;
    closing_date: string | null;
    observations: string | null;
    international: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    formated_opening_date: string;
    formated_closing_date: string;
    causative_name: string | null;
    name: string;
    state: FileState;
    last_movement_date: string | null;
    last_movement_dependency: string | null;
}

export interface FileMovement {
    id: number;
    file_id: number;
    dependency_id: number | null;
    folios: number | null;
    date: string | null;
    purpose: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    formated_date: string;
    dependency_abbreiation: string;
}

export interface FileFormData {
    id?: number;
    number: string;
    year: number | string;
    causative_id?: number | null;
    causative_type?: string | null;
    statement?: string | null;
    type: string;
    dependency_id?: number | null;
    opening_date?: string | null;
    closing_date?: string | null;
    observations?: string | null;
    international: boolean;
}

export interface FileMovementFormData {
    id?: number;
    file_id?: number | null;
    dependency_id?: number | null;
    folios?: number | null;
    date?: string | null;
    purpose?: string | null;
    observations?: string | null;
}
