import { usePage, router } from "@inertiajs/react"
import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { Filter, Search as SearchIcon } from "lucide-react"
import { PageFilterDialog } from "@/components/dialogs/page-filter-dialog"
import { ResultsList } from "@/components/website/result-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { BaseResult, DropdownOption, SearchFilters } from "@/types"
import { route } from "ziggy-js"
import type { RequestPayload } from "@inertiajs/core"

dayjs.locale("es")

const normalizeFilters = (filters: SearchFilters | undefined): Record<string, unknown> => {
  if (!filters) return {}

  const normalizeSection = (section: Record<string, unknown> | undefined) => {
    if (!section) return undefined

    const normalized = Object.keys(section)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        const value = section[key]
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {})

    return Object.keys(normalized).length > 0 ? normalized : undefined
  }

  const result: Record<string, unknown> = {}
  const convenio = normalizeSection(filters.convenio as Record<string, unknown> | undefined)
  const expediente = normalizeSection(filters.expediente as Record<string, unknown> | undefined)

  if (convenio) result.convenio = convenio
  if (expediente) result.expediente = expediente
  if (filters.q !== undefined) result.q = filters.q

  return result
}

const areSearchFiltersEqual = (a: SearchFilters, b: SearchFilters) =>
  JSON.stringify(normalizeFilters(a)) === JSON.stringify(normalizeFilters(b))

type SearchPanelProps = {
  title?: string
  description?: string
  link: string
}

export function SearchPanel({ title, description, link }: SearchPanelProps) {
  const {
    results = [],
    convenios_tipos = [],
    instituciones = [],
    dependencias = [],
    firmantes_unsa = [],
    expedientes = [],
    renovaciones_convenios_tipos = [],
    expedientes_tipos = [],
    personas = [],
    q: pageQuery = "",
    filters: pageFilters = {},
  } = usePage().props as unknown as {
    results?: BaseResult[]
    convenios_tipos: DropdownOption[]
    instituciones: DropdownOption[]
    dependencias: DropdownOption[]
    firmantes_unsa: DropdownOption[]
    expedientes: DropdownOption[]
    renovaciones_convenios_tipos: DropdownOption[]
    expedientes_tipos: DropdownOption[]
    personas: DropdownOption[]
    q?: string
    filters?: SearchFilters
  }

  const [searchQuery, setSearchQuery] = useState<string>(pageQuery ?? "")
  const [showFilters, setShowFilters] = useState(false)
  const resolvedTitle = title ?? "Busqueda"
  const initialFilters = useMemo<SearchFilters>(() => {
    if (pageFilters && typeof pageFilters === "object" && !Array.isArray(pageFilters)) {
      const filters: SearchFilters = {}

      if (
        pageFilters.convenio &&
        typeof pageFilters.convenio === "object" &&
        !Array.isArray(pageFilters.convenio)
      ) {
        filters.convenio = { ...pageFilters.convenio }
      }

      if (
        pageFilters.expediente &&
        typeof pageFilters.expediente === "object" &&
        !Array.isArray(pageFilters.expediente)
      ) {
        filters.expediente = { ...pageFilters.expediente }
      }

      return filters
    }

    return {}
  }, [pageFilters])
  const [nestedFilters, setNestedFilters] = useState<SearchFilters>(initialFilters)

  useEffect(() => {
    setSearchQuery(pageQuery ?? "")
  }, [pageQuery])

  useEffect(() => {
    setNestedFilters((prev) =>
      areSearchFiltersEqual(prev, initialFilters) ? prev : initialFilters,
    )
  }, [initialFilters])

  const buildNestedPayload = (): RequestPayload => {
    const convenio = {
      expediente_id: nestedFilters.convenio?.expediente_id ?? undefined,
      tipo_convenio: nestedFilters.convenio?.tipo_convenio ?? undefined,
      institucion_id: nestedFilters.convenio?.institucion_id ?? undefined,
      dependencia_id: nestedFilters.convenio?.dependencia_id ?? undefined,
      firmante_unsa_id: nestedFilters.convenio?.firmante_unsa_id ?? undefined,
      tipo_renovacion: nestedFilters.convenio?.tipo_renovacion ?? undefined,
      internacional: nestedFilters.convenio?.internacional ?? undefined,
    }

    const expediente = {
      anio: nestedFilters.expediente?.anio ?? undefined,
      tipo: nestedFilters.expediente?.tipo ?? undefined,
      dependencia_id: nestedFilters.expediente?.dependencia_id ?? undefined,
      causante_dependencia_id: nestedFilters.expediente?.causante_dependencia_id ?? undefined,
      causante_institucion_id: nestedFilters.expediente?.causante_institucion_id ?? undefined,
      causante_persona_id: nestedFilters.expediente?.causante_persona_id ?? undefined,
    }

    // Limpia claves vacias/undefined para no mandar ruido en la querystring
    const clean = (obj: Record<string, any>) =>
      Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && v !== null))

    const payload: Record<string, any> = { q: searchQuery ?? "" }

    const cleanedConvenio = clean(convenio)
    if (Object.keys(cleanedConvenio).length > 0) payload.convenio = cleanedConvenio

    const cleanedExpediente = clean(expediente)
    if (Object.keys(cleanedExpediente).length > 0) payload.expediente = cleanedExpediente

    return payload
  }

  const handleSearch = () => {
    router.get(route(link), buildNestedPayload(), {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const applyFiltersAndSearch = () => {
    router.get(route(link), buildNestedPayload(), {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const effectiveResults: BaseResult[] = results ?? []

  return (
    <>
      <Card className="border-[#0e3b64]/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0e3b64] dark:text-[#5a9fd4]">{resolvedTitle}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por convenio, expediente, institución, dependencia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-14 rounded-full border-2 border-[#0e3b64]/30 pl-12 pr-4 text-base shadow-sm focus:border-[#3e7fca]"
                />
              </div>

              <div className="flex w-full flex-wrap justify-center gap-2 md:w-auto md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="h-11 rounded-full border-2 border-[#0e3b64]/40 bg-white px-6 text-base text-[#0e3b64] shadow-sm transition-all hover:bg-[#0e3b64]/10 hover:shadow-md"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button
                  onClick={handleSearch}
                  className="h-11 rounded-full bg-[#0e3b64] px-8 text-base text-white shadow-md transition-all hover:bg-[#3e7fca] hover:shadow-lg"
                >
                  <SearchIcon className="h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          <ResultsList results={effectiveResults} />
        </CardContent>
      </Card>

      <PageFilterDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        value={nestedFilters}
        onChange={setNestedFilters}
        options={{
          convenios_tipos,
          instituciones,
          dependencias,
          firmantes_unsa,
          expedientes,
          renovaciones_convenios_tipos,
          expedientes_tipos,
          personas,
        }}
        onClear={() => setNestedFilters({})}
        onApply={applyFiltersAndSearch}
      />
    </>
  )
}
