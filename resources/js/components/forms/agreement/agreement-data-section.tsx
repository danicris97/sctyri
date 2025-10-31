import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComboBox } from "@/components/ui/combobox"
import { Textarea } from "@/components/ui/textarea"
import { AgreementFormData } from "@/types/agreement"
import { Option } from "@/types"

type AgreementDataSectionProps = {
  data: AgreementFormData
  agreements_types: Option[]
  agreements_renewal_types: Option[]
  errors: Record<string, string>
  onChange: (key: keyof AgreementFormData, value: any) => void
}

export function AgreementDataSection({ data, agreements_types, agreements_renewal_types, errors, onChange }: AgreementDataSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
      <div>
        <Label htmlFor="agreements_types">Tipo de Convenio *</Label>
        <ComboBox
          options={agreements_types}
          value={data.type}
          onChange={(val) => onChange("type", val || "")}
          placeholder="Seleccione tipo"
          className="w-full"
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
      </div>

      <div>
        <Label htmlFor="duration">Duración (meses) *</Label>
        <Input
          id="duration"
          name="duration"
          placeholder="Cantidad de meses"
          value={data.duration}
          onChange={(e) => onChange("duration", Number.parseInt(e.target.value) || 0)}
        />
        {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
      </div>

      <div>
        <Label htmlFor="date_signature">Fecha de Firma *</Label>
        <Input
          id="date_signature"
          type="date"
          value={data.date_signature?.split("T")[0]}
          onChange={(e) => onChange("date_signature", e.target.value)}
        />
        {errors.date_signature && <p className="text-red-500 text-sm">{errors.date_signature}</p>}
      </div>

      <div>
        <Label htmlFor="agreements_renewal_types">Tipo de Renovacion *</Label>
        <ComboBox
          options={agreements_renewal_types}
          value={data.type_renewal}
          onChange={(val) => onChange("type_renewal", val || "")}
          placeholder="Seleccione tipo"
          className="w-full"
        />
        {errors.type_renewal && <p className="text-red-500 text-sm">{errors.type_renewal}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="international"
          type="checkbox"
          checked={data.international || false}
          onChange={(e) => onChange("international", e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="international">Internacional</Label>
      </div>

      {/* object */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="object" className="text-sm font-medium">object</Label>
        <Textarea
          id="object"
          placeholder="Finalidad o propósito del convenio..."
          value={data.object || ""}
          onChange={(e) => onChange("object", e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.object ? "border-red-500" : ""}
        />
        {errors.object && <p className="text-red-500 text-sm">{errors.object}</p>}
        <div className="flex justify-between items-center mt-1">
          <span className="text-muted-foreground text-xs">
            {data.object?.length || 0}/255 caracteres
          </span>
        </div>
      </div>

      {/* Observaciones */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="observations" className="text-sm font-medium">Observaciones</Label>
        <Textarea
          id="observations"
          placeholder="Notas adicionales, aclaraciones..."
          value={data.observations || ""}
          onChange={(e) => onChange("observations", e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.observations ? "border-red-500" : ""}
        />
        {errors.observations && <p className="text-red-500 text-sm">{errors.observations}</p>}
        <div className="flex justify-end mt-1">
          <span className="text-muted-foreground text-xs">
            {data.observations?.length || 0}/255 caracteres
          </span>
        </div>
      </div>

      {/* Resumen */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="summary" className="text-sm font-medium">Resumen</Label>
        <Textarea
          id="summary"
          placeholder="Resumen del convenio..."
          value={data.summary || ""}
          onChange={(e) => onChange("summary", e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.summary ? "border-red-500" : ""}
        />
        {errors.summary && <p className="text-red-500 text-sm">{errors.summary}</p>}
        <div className="flex justify-end mt-1">
          <span className="text-muted-foreground text-xs">
            {data.summary?.length || 0}/255 caracteres
          </span>
        </div>
      </div>
    </div>
  )
}
