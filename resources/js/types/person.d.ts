export type PersonPositionType = 'Rector' | 'Vicerector' | 'Interventor' | 'Secretario' | 'Decano' | 'Vicedecano' | 'Jefe de Sección' | 'Administrativo' | 'Responsable' | 'Representante' | 'Investigador' | 'Docente' | 'Alumno' | 'Externo';

export interface Person {
    id: number;
    name: string;
    surname: string;
    dni: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    nationality: number | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface PersonPosition {
    id: number;
    person_id: number;
    position: PersonPositionType;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    person: Person;
}

export interface PersonPositionFormData {
    id?: number;
    person_id: number | string | null;
    position: string | '';
    active: boolean;
    person: {
        id?: number;
        name: string;
        surname: string;
        dni: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        nationality: number | string | null;
    };
}
