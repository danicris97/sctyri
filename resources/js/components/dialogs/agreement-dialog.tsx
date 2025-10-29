import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GenericDialog } from "@/components/ui/generic-dialog"
import { ComboBox } from "@/components/ui/combobox"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js" // Import route from ziggy-js
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DropdownOption } from "@/types"

interface ConvenioFiltersDialogProps {
  open: boolean
  onClose: () => void
  filters: {
    tipo_convenio: string
    expediente_id: string
    tipo_renovacion: string
    internacional: boolean
    fecha_desde: string
    fecha_hasta: string
    institucion_id: string
    unidad_academica_id: string
    firmante_unsa_id: string
  }
  onFiltersChange: (filters: any) => void
  options: {
    convenios_tipos: DropdownOption[]
    instituciones: DropdownOption[]
    unidades_academicas: DropdownOption[]
    firmantes_unsa: DropdownOption[]
    expedientes: DropdownOption[]
    renovaciones_convenios_tipos: DropdownOption[]
  }
}

export function ConvenioFiltersDialog({
  open,
  onClose,
  filters,
  onFiltersChange,
  options,
}: ConvenioFiltersDialogProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleSearch = () => {
    router.get(
      route("convenios.convenios.index"),
      {
        tipo_convenio: filters.tipo_convenio,
        tipo_renovacion: filters.tipo_renovacion,
        internacional: filters.internacional,
        fecha_desde: filters.fecha_desde,
        fecha_hasta: filters.fecha_hasta,
        expediente_id: filters.expediente_id,
        institucion_id: filters.institucion_id,
        unidad_academica_id: filters.unidad_academica_id,
        firmante_unsa_id: filters.firmante_unsa_id,
      },
      { preserveState: true },
    )
    onClose()
  }

  const handleClear = () => {
    router.get(route("convenios.convenios.index"))
    onClose()
  }

  return (
    <GenericDialog
      size="lg"
      open={open}
      onClose={onClose}
      title="Filtros"
      description="Filtrar resultados de la tabla"
      footer={
        <>
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
          <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" onClick={handleSearch}>
            Buscar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Expediente</Label>
          <ComboBox
            options={options.expedientes.map((exp) => ({
              ...exp,
              value: String(exp.value),
            }))}
            value={filters.expediente_id ? String(filters.expediente_id) : ""}
            onChange={(val) => {
              handleFilterChange("expediente_id", val ? Number.parseInt(val) : null)
            }}
            placeholder="Seleccione un expediente"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="tipo_convenio">Tipo de Convenio</Label>
          <ComboBox
            options={options.convenios_tipos}
            value={filters.tipo_convenio}
            onChange={(val) => handleFilterChange("tipo_convenio", val ?? "")}
            placeholder="Seleccione un tipo"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fecha_desde">Fecha desde</Label>
            <Input
              id="fecha_desde"
              type="date"
            value={filters.fecha_desde}
            onChange={(e) => handleFilterChange("fecha_desde", e.target.value)}
          />
          </div>

          <div>
            <Label htmlFor="fecha_hasta">Fecha hasta</Label>
            <Input
              id="fecha_hasta"
              type="date"
              value={filters.fecha_hasta}
              onChange={(e) => handleFilterChange("fecha_hasta", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="institucion_id">Institución</Label>
          <ComboBox
            options={options.instituciones.map((inst) => ({
              ...inst,
              value: String(inst.value),
            }))}
            value={filters.institucion_id ? String(filters.institucion_id) : ""}
            onChange={(val) => {
              handleFilterChange("institucion_id", val ? Number.parseInt(val) : null)
            }}
            placeholder="Seleccione una institución"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="unidad_academica_id">Unidad Académica</Label>
          <ComboBox
            options={options.unidades_academicas.map((ua) => ({
              ...ua,
              value: String(ua.value),
            }))}
            value={filters.unidad_academica_id ? String(filters.unidad_academica_id) : ""}
            onChange={(val) => {
              handleFilterChange("unidad_academica_id", val ? Number.parseInt(val) : null)
            }}
            placeholder="Seleccione una unidad académica"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="firmante_unsa_id">Firmante</Label>
          <ComboBox
            options={options.firmantes_unsa.map((p) => ({
              ...p,
              value: String(p.value),
            }))}
            value={filters.firmante_unsa_id ? String(filters.firmante_unsa_id) : ""}
            onChange={(val) => {
              handleFilterChange("firmante_unsa_id", val ? Number.parseInt(val) : null)
            }}
            placeholder="Seleccione un firmante"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tipo de Renovación</Label>
            <ComboBox
              options={options.renovaciones_convenios_tipos}
              value={filters.tipo_renovacion}
              onChange={(val) => handleFilterChange("tipo_renovacion", val ?? "")}
              placeholder="Seleccione un tipo"
            />
          </div>

          <div>
            <Label>Internacional</Label>
            <RadioGroup
              value={
                filters.internacional === true
                  ? "true"
                  : filters.internacional === false
                    ? "false"
                    : "any"
              }
              onValueChange={(val) =>
                handleFilterChange("internacional", val === "any" ? null : val === "true")
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="true" id="internacional-si" />
                <Label htmlFor="internacional-si">Si</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="false" id="internacional-no" />
                <Label htmlFor="internacional-no">No</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="any" id="internacional-no-aplica" />
                <Label htmlFor="internacional-no-aplica">No aplica</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </GenericDialog>
  )
}
