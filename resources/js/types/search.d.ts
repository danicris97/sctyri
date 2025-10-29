import { Option } from "@/types/index"

export type ResultKind = "convenio" | "expediente"

export type BaseResult = {
  id: number | string
  kind: ResultKind
  /** Main title to show in the card */
  title: string
  /** Subtitle (e.g., institución o dependencia) */
  subtitle?: string
  /** Optional status label (e.g., "Resuelto", "En proceso") */
  status?: string
  /** Key stats displayed as label/value pairs */
  stats?: Array<{ label: string; value: string }>
  /** URL to open detail page (provided by backend via accessors/Ziggy) */
  href?: string
}

/*export type ConvenioFilters = {
  expediente_id?: number | null
  tipo_convenio?: string
  estado?: string
  fecha_desde?: string
  fecha_hasta?: string
  institucion_id?: string | number | null
  dependencia_id?: number | null
  firmante_unsa_id?: number | null
  tipo_renovacion?: string
  internacional?: boolean | null
}

export type ExpedienteFilters = {
  numero?: string
  anio?: string
  tipo?: string
  dependencia_id?: string | number | null
  causante_dependencia_id?: string | number | null
  causante_institucion_id?: string | number | null
  causante_persona_id?: string | number | null
  fecha_inicio?: string
  fecha_cierre?: string
  estado?: string
}

export type SearchFilters = {
  q?: string
  convenio?: ConvenioFilters
  expediente?: ExpedienteFilters
}

export type SearchOptions = {
  expedientes?: Option[]
  convenios_tipos?: Option[]
  instituciones?: Option[]
  unidades_academicas?: Option[]
  firmantes_unsa?: Option[]
  renovaciones_convenios_tipos?: Option[]
  dependencias?: Option[]
  expedientes_tipos?: Option[]
  personas?: Option[]
}*/
