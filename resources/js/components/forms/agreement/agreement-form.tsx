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
  const { data, setData, processing, errors, handleSubmit } = useAgreementForm({ agreement })
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [fileOptions, setFileOptions] = useState<Option[]>(files ?? [])

  const openFileDialog = () => setIsFileDialogOpen(true)
  const closeFileDialog = () => setIsFileDialogOpen(false)

  useEffect(() => {
    if (!Array.isArray(files)) return
    setFileOptions((prev) => {
      const existingIds = new Set(prev.map((option) => String(option.value)))
      const additions = files.filter((option) => !existingIds.has(String(option.value)))
      return additions.length > 0 ? [...prev, ...additions] : prev
    })
  }, [files])

  useEffect(() => {
    const current = data?.resolution?.file_id
    if (!current) return
    const label =
      (current as any)?.nombre ??
      [current.number, current.year].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${current}`

    setFileOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === current)
      return exists ? prev : [...prev, { value: current, label }]
    })
  }, [data?.resolution?.file_id])

  const handleFileCreated = (file: { id: number; nombre?: string | null; number?: string; anio?: number }) => {
    const label =
      file?.nombre ??
      [file?.number, file?.anio].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${file.id}`

    setFileOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === file.id)
      if (exists) {
        return prev.map((option) =>
          Number(option.value) === file.id ? { ...option, label } : option
        )
      }
      return [...prev, { value: file.id, label }]
    })

    setData((prev: AgreementFormData) => {
      const previousResolution = (prev as any)?.resolution
      const fallback = {
        id: previousResolution?.id ?? null,
        number: previousResolution?.number ?? "",
        date: previousResolution?.date ?? "",
        type: previousResolution?.type ?? null,
        link: previousResolution?.link ?? null,
        file_id: previousResolution?.file_id ?? null,
        file: previousResolution?.file ?? null,
      }

      return {
        ...prev,
        resolution: {
          ...(previousResolution ?? fallback),
          file_id: file.id,
          file: file as any,
        },
      } as typeof prev
    })

    closeFileDialog()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seccion Resolucion */}
      {showResolutionSection && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Resolucion</h3>
          <ResolutionSection
            resolution={data?.resolution}
            resolutions_types={resolutions_types ?? []}
            files={fileOptions}
            errors={errors}
            onOpenNewFile={openFileDialog}
          />
        </div>
      )}

      {/* Seccion de Datos del Convenio */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Datos del Convenio</h3>
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
          personPositionsProps={person_positions}
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
