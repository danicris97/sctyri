
export type InstitutionType = 'Agencia' | 'Agremiacion' | 'Asociacion' | 'Consejo' | 'Deportiva' | 'Educativa' | 'Empresa' | 'Ente' | 'Fundacion' | 'Gobierno' | 'Gubernamental' | 'Instituto' | 'Nacion' | 'Municipal' | 'Medica' | 'Sindical' | 'ONG' | 'Universitaria' | 'Otro';

export interface Institution {
  id: number;
  name: string;
  type: InstitutionType;
  cuit: string | null;
  country_id: number | null;
  province_id: number | null;
  city_id: number | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  web: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}