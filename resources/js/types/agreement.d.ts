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
    date_signature: Date;
    date_end: Date | null;
    date_renewal: Date | null;
    duration: number | 0;
    type_renewal: AgreementRenewalType | null;
    international: boolean;
    subject: string;
    observations: string | null;
    status: AgreementStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    name: string;
    title: string;
    formated_date_signature: string;
    formated_date_end: string;
    formated_date_renewal: string;
}

export interface AgreementRenewal {
    id: number;
    agreement_id: number;
    start_date: Date;
    end_date: Date | null;
    duration: number | 0;
    observations: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_start_date: string;
    formated_end_date: string;
}

export interface AgreementCancellation {
    id: number;
    agreement_id: number;
    reason: string;
    cancellation_date: Date;
    resolution_id: number | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    formated_cancellation_date: string;
}