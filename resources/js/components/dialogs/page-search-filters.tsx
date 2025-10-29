import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ComboBox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { SearchFilters, SearchOptions } from "@/types/search"

export function PageSearchFilters({
  value,
  onChange,
  options,
  onClear,
  onApply,
}: {
  value: SearchFilters
  onChange: (f: SearchFilters) => void
  options?: SearchOptions
  onClear: () => void
  onApply: () => void
}) {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="convenio">
        <TabsList className="w-full grid grid-cols-2 gap-2">
          <TabsTrigger className="w-full" value="convenio">Convenios</TabsTrigger>
          <TabsTrigger className="w-full" value="expediente">Expedientes</TabsTrigger>
        </TabsList>

        {/* CONVENIOS */}
        <TabsContent value="convenio" className="space-y-4 py-2">
          {/* Expediente */}
          <div className="grid gap-2">
            <Label>Expediente</Label>
            <ComboBox
              options={(options?.expedientes ?? []).map((exp) => ({ ...exp, value: String(exp.value) }))}
              value={value.convenio?.expediente_id ? String(value.convenio?.expediente_id) : ""}
              onChange={(val) => onChange({ ...value, convenio: { ...value.convenio, expediente_id: val ? parseInt(val) : null } })}
              placeholder="Seleccione un expediente"
              className="w-full"
            />
          </div>

          {/* Tipo de Convenio */}
          <div className="grid gap-2">
            <Label>Tipo de Convenio</Label>
            <ComboBox
              options={options?.convenios_tipos ?? []}
              value={value.convenio?.tipo_convenio ?? ""}
              onChange={(v) => onChange({ ...value, convenio: { ...value.convenio, tipo_convenio: v ?? "" } })}
              placeholder="Seleccionar tipo"
            />
          </div>

          {/* Institución */}
          <div className="grid gap-2">
            <Label>Institución</Label>
            <ComboBox
              options={(options?.instituciones ?? []).map((i) => ({ ...i, value: String(i.value) }))}
              value={value.convenio?.institucion_id ? String(value.convenio?.institucion_id) : ""}
              onChange={(val) => onChange({ ...value, convenio: { ...value.convenio, institucion_id: val ? parseInt(val) : null } })}
              placeholder="Seleccione una institución"
            />
          </div>

          {/* Unidad Académica */}
          <div className="grid gap-2">
            <Label>Unidad Académica</Label>
            <ComboBox
              options={(options?.unidades_academicas ?? options?.dependencias ?? []).map((d) => ({ ...d, value: String(d.value) }))}
              value={value.convenio?.dependencia_id ? String(value.convenio?.dependencia_id) : ""}
              onChange={(val) => onChange({ ...value, convenio: { ...value.convenio, dependencia_id: val ? parseInt(val) : null } })}
              placeholder="Seleccione una unidad académica"
            />
          </div>

          {/* Firmante */}
          <div className="grid gap-2">
            <Label>Firmante</Label>
            <ComboBox
              options={(options?.firmantes_unsa ?? []).map((p) => ({ ...p, value: String(p.value) }))}
              value={value.convenio?.firmante_unsa_id ? String(value.convenio?.firmante_unsa_id) : ""}
              onChange={(val) => onChange({ ...value, convenio: { ...value.convenio, firmante_unsa_id: val ? parseInt(val) : null } })}
              placeholder="Seleccione un firmante"
            />
          </div>

          {/* Tipo de Renovación */}
          <div className="grid gap-2">
            <Label>Tipo de Renovación</Label>
            <ComboBox
              options={options?.renovaciones_convenios_tipos ?? []}
              value={value.convenio?.tipo_renovacion ?? ""}
              onChange={(v) => onChange({ ...value, convenio: { ...value.convenio, tipo_renovacion: v ?? "" } })}
              placeholder="Seleccione un tipo"
            />
          </div>

          {/* Internacional */}
          <div className="grid gap-2">
            <Label>Internacional</Label>
            <RadioGroup
              value={
                value.convenio?.internacional === true
                  ? "true"
                  : value.convenio?.internacional === false
                    ? "false"
                    : "any"
              }
              onValueChange={(val) =>
                onChange({
                  ...value,
                  convenio: {
                    ...value.convenio,
                    internacional: val === "any" ? null : val === "true",
                  },
                })
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
        </TabsContent>

        {/* EXPEDIENTES */}
        <TabsContent value="expediente" className="space-y-4 py-2">
          {/* Año */}
          <div className="grid gap-2">
            <Label>Año</Label>
            <Input
              value={value.expediente?.anio ?? ""}
              onChange={(e) => onChange({ ...value, expediente: { ...value.expediente, anio: e.target.value } })}
            />
          </div>

          {/* Tipo */}
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <ComboBox
              options={(options?.expedientes_tipos ?? []).map((t) => ({ ...t, value: String(t.value) }))}
              value={value.expediente?.tipo ? String(value.expediente?.tipo) : ""}
              onChange={(val) => onChange({ ...value, expediente: { ...value.expediente, tipo: val ?? "" } })}
              placeholder="Seleccione un tipo"
            />
          </div>

          {/* Dependencia */}
          <div className="grid gap-2">
            <Label>Dependencia</Label>
            <ComboBox
              options={(options?.dependencias ?? []).map((d) => ({ ...d, value: String(d.value) }))}
              value={value.expediente?.dependencia_id ? String(value.expediente?.dependencia_id) : ""}
              onChange={(val) => onChange({ ...value, expediente: { ...value.expediente, dependencia_id: val ? parseInt(val, 10) : null } })}
              placeholder="Seleccione una dependencia"
            />
          </div>

          {/* Causante Dependencia */}
          <div className="grid gap-2">
            <Label>Causante Dependencia</Label>
            <ComboBox
              options={(options?.dependencias ?? []).map((d) => ({ ...d, value: String(d.value) }))}
              value={value.expediente?.causante_dependencia_id ? String(value.expediente?.causante_dependencia_id) : ""}
              onChange={(val) => onChange({ ...value, expediente: { ...value.expediente, causante_dependencia_id: val ? parseInt(val, 10) : null } })}
              placeholder="Seleccione una dependencia"
            />
          </div>

          {/* Causante Institución */}
          <div className="grid gap-2">
            <Label>Causante Institución</Label>
            <ComboBox
              options={(options?.instituciones ?? []).map((i) => ({ ...i, value: String(i.value) }))}
              value={value.expediente?.causante_institucion_id ? String(value.expediente?.causante_institucion_id) : ""}
              onChange={(val) => onChange({ ...value, expediente: { ...value.expediente, causante_institucion_id: val ? parseInt(val, 10) : null } })}
              placeholder="Seleccione una institución"
            />
          </div>

          {/* Causante Persona */}
          <div className="grid gap-2">
            <Label>Causante Persona</Label>
            <ComboBox
              options={(options?.personas ?? []).map((p) => ({ ...p, value: String(p.value) }))}
              value={value.expediente?.causante_persona_id ? String(value.expediente?.causante_persona_id) : ""}
              onChange={(val) => onChange({ ...value, expediente: { ...value.expediente, causante_persona_id: val ? parseInt(val, 10) : null } })}
              placeholder="Seleccione una persona"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClear}>Limpiar</Button>
        <Button className="bg-[#0e3b64] hover:bg-[#3e7fca]" onClick={onApply}>Aplicar filtros</Button>
      </div>
    </div>
  )
}
