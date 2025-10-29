
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
    type: FileType;
    dependency_id: number;
    opening_date: Date;
    closing_date: Date | null;
    observations: string | null;
    international: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_opening_date: string;
    formated_closing_date: string;
    causative_name: string | null;
    name: string;
    state: FileState;
    last_movement_date: Date | null;
    last_movement_dependency: string | null;
}

export interface FileMovement {
    id: number;
    file_id: number;
    dependency_id: number;
    folios: number | null;
    date: Date;
    purpose: string | null;
    observations: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_date: string;
    dependency_abbreiation: string;
}