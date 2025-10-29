import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComboBox } from "@/components/ui/combobox"
import { Textarea } from "@/components/ui/textarea"
import type { ConvenioFullType } from "@/schemas/convenio-schema"
import { DropdownOption } from "@/types"

type ConvenioDataSectionProps = {
  data: ConvenioFullType
  convenios_tipos: DropdownOption[]
  renovaciones_convenios_tipos: DropdownOption[]
  errors: Record<string, string>
  onChange: (key: keyof ConvenioFullType, value: any) => void
}

export function ConvenioDataSection({ data, convenios_tipos, renovaciones_convenios_tipos, errors, onChange }: ConvenioDataSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
      <div>
        <Label htmlFor="convenios_tipos">Tipo de Convenio *</Label>
        <ComboBox
          options={convenios_tipos}
          value={data.tipo_convenio}
          onChange={(val) => onChange("tipo_convenio", val || "")}
          placeholder="Seleccione tipo"
          className="w-full"
        />
        {errors.tipo_convenio && <p className="text-red-500 text-sm">{errors.tipo_convenio}</p>}
      </div>

      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          value={data.titulo || ""}
          onChange={(e) => onChange("titulo", e.target.value)}
        />
        {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo}</p>}
      </div>

      <div>
        <Label htmlFor="duracion">Duración (meses) *</Label>
        <Input
          id="duracion"
          name="duracion"
          placeholder="Cantidad de meses"
          value={data.duracion}
          onChange={(e) => onChange("duracion", Number.parseInt(e.target.value) || 0)}
        />
        {errors.duracion && <p className="text-red-500 text-sm">{errors.duracion}</p>}
      </div>

      <div>
        <Label htmlFor="fecha_firma">Fecha de Firma *</Label>
        <Input
          id="fecha_firma"
          type="date"
          value={data.fecha_firma.split("T")[0]}
          onChange={(e) => onChange("fecha_firma", e.target.value)}
        />
        {errors.fecha_firma && <p className="text-red-500 text-sm">{errors.fecha_firma}</p>}
      </div>

      <div>
        <Label htmlFor="tipo_renovacion">Tipo de Renovacion *</Label>
        <ComboBox
          options={renovaciones_convenios_tipos}
          value={data.tipo_renovacion}
          onChange={(val) => onChange("tipo_renovacion", val || "")}
          placeholder="Seleccione tipo"
          className="w-full"
        />
        {errors.tipo_renovacion && <p className="text-red-500 text-sm">{errors.tipo_renovacion}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="internacional"
          type="checkbox"
          checked={data.internacional || false}
          onChange={(e) => onChange("internacional", e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="internacional">Internacional</Label>
      </div>

      {/* Objeto */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="objeto" className="text-sm font-medium">Objeto</Label>
        <Textarea
          id="objeto"
          placeholder="Finalidad o propósito del convenio..."
          value={data.objeto || ""}
          onChange={(e) => onChange("objeto", e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.objeto ? "border-red-500" : ""}
        />
        {errors.objeto && <p className="text-red-500 text-sm">{errors.objeto}</p>}
        <div className="flex justify-between items-center mt-1">
          <span className="text-muted-foreground text-xs">
            {data.objeto?.length || 0}/255 caracteres
          </span>
        </div>
      </div>

      {/* Observaciones */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="observaciones" className="text-sm font-medium">Observaciones</Label>
        <Textarea
          id="observaciones"
          placeholder="Notas adicionales, aclaraciones..."
          value={data.observaciones || ""}
          onChange={(e) => onChange("observaciones", e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.observaciones ? "border-red-500" : ""}
        />
        {errors.observaciones && <p className="text-red-500 text-sm">{errors.observaciones}</p>}
        <div className="flex justify-end mt-1">
          <span className="text-muted-foreground text-xs">
            {data.observaciones?.length || 0}/255 caracteres
          </span>
        </div>
      </div>
    </div>
  )
}
