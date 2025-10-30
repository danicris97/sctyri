/**
 * Tipos para los coincidir con los enums en la base de datos
 */

export type AgreementStatus = 'Activo' | 'Proximo a Vencer' | 'Vencido' | 'Renovado' | 'Cancelado' | 'Pendiente';

export type AgreementRenewalType = 'Partes Iguales' | 'Escalera' | 'Unica' | 'Unica Mita de Periodo' | 'Unica Anual' | 'Anual' | 'Sin Renovacion' | 'Renovable de Comun Acuerdo' | 'Pendiente';

export type AgreementType = 'Marco' | 'Adhesion' | 'Colaboracion' | 'Cooperacion' | 'Comision de Estudio' | 'Especifico' | 'Investigacion' | 'Intercambio' | 'Pasantia' | 'PPS' | 'Proyecto' | 'Prestacion de Servicio' | 'Subvencion' | 'Vinculación Tecnologica' | 'Acta Acuerdo' | 'Acta Complemento' | 'Acta Compromiso' | 'Acta Especifica' | 'Acuerdo' | 'Acuerdo Complementario' | 'Acuerdo Cooperacion' | 'Acuerdo Especifico' | 'Acuerdo Investigacion' | 'Adenda' | 'Anexo' | 'Carta Intencion' | 'Memorandum' | 'Protocolo' | 'Protocolo Adicional' | 'Protocolo de Colaboracion' | 'Protocolo Especifico' | 'Protocolo de Investigacion';

/**
 * Interfaces para los convenios
 */


export interface Agreement {
    id: number;
    uuid: string;
    type: AgreementType;
    date_signature: string;
    date_end: string | null;
    date_renewal: string | null;
    duration: number;
    type_renewal: AgreementRenewalType | null;
    international: boolean;
    object: string | null;
    summary: string | null;
    observations: string | null;
    status: AgreementStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    name: string;
    title: string;
    formated_date_signature: string;
    formated_date_end: string;
    formated_date_renewal: string;
}

export interface AgreementRenewal {
    id: number;
    agreement_id: number;
    start_date: string;
    end_date: string | null;
    duration: number;
    observations: string | null;
    resolution_id?: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    formated_start_date: string;
    formated_end_date: string;
    agreement_name: string;
}

export interface AgreementCancellation {
    id: number;
    agreement_id: number;
    reason: string;
    cancellation_date: string;
    resolution_id?: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    formated_cancellation_date: string;
}

export interface AgreementRenewalFormData {
    id?: number;
    agreement_id?: number | null;
    start_date?: string;
    end_date?: string | null;
    duration?: number | null;
    observations?: string | null;
    resolution_id?: number | null;
}

export interface AgreementCancellationFormData {
    id?: number;
    agreement_id?: number | null;
    reason?: string;
    cancellation_date?: string;
    resolution_id?: number | null;
}

export interface AgreementFormData {
    id?: number;
    type?: AgreementType | string;
    date_signature?: string;
    duration?: number;
    type_renewal?: AgreementRenewalType | string | null;
    international?: boolean;
    object?: string | null;
    summary?: string | null;
    observations?: string | null;
    resolution_id?: number | null;
    resolution?: {
        id?: number;
        number?: string;
        date?: string;
        type?: string;
        link?: string;
        file_id?: number;
    } | null;
    institutions?: number[];
    dependencies?: number[];
    person_positions?: number[];
}