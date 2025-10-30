import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAgreementForm } from "@/hooks/use-agreement-form"
import { AgreementDataSection } from "./agreement-data-section"
import { RelationsSection } from "./relations-section"
import { Option } from "@/types"
import { Agreement, AgreementFormData } from "@/types/agreement"
import { ResolutionSection } from "./resolution-section"

type AgreementFormProps = {
  agreement?: Agreement
  agreements_types: Option[]
  resolutions_types?: Option[]
  files?: Option[]
  files_types?: Option[]
  institutions: Option[]
  institutions_types: Option[]
  dependencies: Option[]
  dependencies_types: Option[]
  person_positions: Option[]
  persons: Option[]
  positions: Option[]
  agreements_renewal_types: Option[]
  resolutions?: Option[]
  showResolutionSection?: boolean
}

export default function agreementForm({
  agreement,
  agreements_types = [],
  resolutions_types = [],
  files = [],
  files_types = [],
  institutions = [],
  institutions_types = [],
  dependencies = [],
  dependencies_types = [],
  person_positions = [],
  persons = [],
  positions = [],
  agreements_renewal_types = [],
  resolutions = [],
  showResolutionSection = true,
}: AgreementFormProps) {
  const { data, setData, processing, errors, updateResolution, handleSubmit } = useAgreementForm({ agreement })
  const [isExpedienteDialogOpen, setIsExpedienteDialogOpen] = useState(false)
  const [fileOptions, setfileOptions] = useState<Option[]>(files ?? [])

  const openFileDialog = () => setIsExpedienteDialogOpen(true)
  const closeExpedienteDialog = () => setIsExpedienteDialogOpen(false)

  useEffect(() => {
    if (!Array.isArray(files)) return
    setfileOptions((prev) => {
      const existingIds = new Set(prev.map((option) => String(option.value)))
      const additions = files.filter((option) => !existingIds.has(String(option.value)))
      return additions.length > 0 ? [...prev, ...additions] : prev
    })
  }, [files])

  useEffect(() => {
    const current = data?.resolucion?.expediente
    if (!current?.id) return
    const label =
      (current as any)?.nombre ??
      [current.numero, current.anio].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${current.id}`

    setfileOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === current.id)
      return exists ? prev : [...prev, { value: current.id, label }]
    })
  }, [data?.resolucion?.expediente?.id])

  const handleExpedienteCreated = (expediente: { id: number; nombre?: string | null; numero?: string; anio?: number }) => {
    const label =
      expediente?.nombre ??
      [expediente?.numero, expediente?.anio].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${expediente.id}`

    setfileOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === expediente.id)
      if (exists) {
        return prev.map((option) =>
          Number(option.value) === expediente.id ? { ...option, label } : option
        )
      }
      return [...prev, { value: expediente.id, label }]
    })

    setData((prev: AgreementFormData) => {
      const previousResolucion = (prev as any)?.resolucion
      const fallback = {
        id: previousResolucion?.id ?? null,
        numero: previousResolucion?.numero ?? "",
        fecha: previousResolucion?.fecha ?? "",
        tipo: previousResolucion?.tipo ?? null,
        link: previousResolucion?.link ?? null,
        expediente_id: previousResolucion?.expediente_id ?? null,
        expediente: previousResolucion?.expediente ?? null,
      }

      return {
        ...prev,
        resolucion: {
          ...(previousResolucion ?? fallback),
          expediente_id: expediente.id,
          expediente: expediente as any,
        },
      } as typeof prev
    })

    closeExpedienteDialog()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seccion Resolucion */}
      {showResolutionSection && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Resolucion</h3>
          <ResolutionSection
            resolution={data?.resolucion}
            resolutions_types={resolutions_types ?? []}
            files={fileOptions}
            onResolutionChange={updateResolution}
            errors={errors}
            onOpenNewFile={openFileDialog}
          />
        </div>
      )}

      {/* Seccion de Datos del agreement */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Datos del agreement</h3>
        <AgreementDataSection
          data={data}
          agreements_types={agreements_types}
          agreements_renewal_types={agreements_renewal_types}
          errors={errors}
          onChange={setData}
        />
      </div>

      {/* Seccion de Participantes / Relaciones */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Participantes</h3>
        <RelationsSection
          data={data}
          institutionsProps={institutions}
          dependenciesProps={dependencies}
          person_positionsProps={person_positions}
          onChange={setData}
          institutions_types={institutions_types}
          dependencies_types={dependencies_types}
          persons={persons}
          positions={positions}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" disabled={processing}>
          {processing
            ? agreement
              ? "Actualizando..."
              : "Creando..."
            : agreement
              ? "Actualizar agreement"
              : "Crear agreement"}
        </Button>
      </div>
    </form>
  )
}
