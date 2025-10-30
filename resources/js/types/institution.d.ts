
export type InstitutionType = 'Agencia' | 'Agremiacion' | 'Asociacion' | 'Consejo' | 'Deportiva' | 'Educativa' | 'Empresa' | 'Ente' | 'Fundacion' | 'Gobierno' | 'Gubernamental' | 'Instituto' | 'Nacion' | 'Municipal' | 'Medica' | 'Sindical' | 'ONG' | 'Universitaria' | 'Otro';

export interface Institution {
  id: number;
  name: string;
  type: string;
  cuit: string | null;
  country_id: number | null;
  country: string | null;
  province_id: number | null;
  province: string | null;
  locality_id: number | null;
  locality: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  web: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface InstitutionFormData {
  id?: number;
  name: string;
  type: string;
  cuit: string | null;
  country: string | null;
  country_id: number | null;
  province: string | null;
  province_id: number | null;
  locality: string | null;
  locality_id: number | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  web: string | null;
  active: boolean;
}