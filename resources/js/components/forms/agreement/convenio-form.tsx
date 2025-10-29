import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useConvenioForm } from "@/hooks/use-convenio-form"
import { ConvenioDataSection } from "./convenio-data-section"
import { RelationsSection } from "./relations-section"
import type { ConvenioFullType } from "@/schemas/convenio-schema"
import type { DropdownOption } from "@/types"
import type { Option } from "@/components/ui/multiselect"
import { ResolucionSection } from "./resolucion-section"
import { GenericDialog } from "@/components/ui/generic-dialog"
import ExpedienteForm from "./expediente-convenio-form"

type ConvenioFormProps = {
  convenio?: ConvenioFullType
  convenios_tipos: DropdownOption[]
  resoluciones_tipos?: DropdownOption[]
  expedientes?: DropdownOption[]
  expedientes_tipos?: DropdownOption[]
  instituciones: DropdownOption[]
  instituciones_tipos: DropdownOption[]
  unidades_academicas: DropdownOption[]
  unidades_academicas_tipos: DropdownOption[]
  firmantes_unsa: DropdownOption[]
  personas: DropdownOption[]
  roles: DropdownOption[]
  renovaciones_convenios_tipos: DropdownOption[]
  resoluciones?: DropdownOption[]
  showResolucionSection?: boolean
}

export default function ConvenioForm({
  convenio,
  convenios_tipos = [],
  resoluciones_tipos = [],
  expedientes = [],
  expedientes_tipos = [],
  instituciones = [],
  instituciones_tipos = [],
  unidades_academicas = [],
  unidades_academicas_tipos = [],
  firmantes_unsa = [],
  personas = [],
  roles = [],
  renovaciones_convenios_tipos = [],
  resoluciones = [],
  showResolucionSection = true,
}: ConvenioFormProps) {
  const { data, setData, processing, errors, updateResolucion, handleSubmit } = useConvenioForm({ convenio })
  const [isExpedienteDialogOpen, setIsExpedienteDialogOpen] = useState(false)
  const [expedienteOptions, setExpedienteOptions] = useState<DropdownOption[]>(expedientes ?? [])

  const openExpedienteDialog = () => setIsExpedienteDialogOpen(true)
  const closeExpedienteDialog = () => setIsExpedienteDialogOpen(false)

  useEffect(() => {
    if (!Array.isArray(expedientes)) return
    setExpedienteOptions((prev) => {
      const existingIds = new Set(prev.map((option) => String(option.value)))
      const additions = expedientes.filter((option) => !existingIds.has(String(option.value)))
      return additions.length > 0 ? [...prev, ...additions] : prev
    })
  }, [expedientes])

  useEffect(() => {
    const current = data?.resolucion?.expediente
    if (!current?.id) return
    const label =
      (current as any)?.nombre ??
      [current.numero, current.anio].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${current.id}`

    setExpedienteOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === current.id)
      return exists ? prev : [...prev, { value: current.id, label }]
    })
  }, [data?.resolucion?.expediente?.id])

  const handleExpedienteCreated = (expediente: { id: number; nombre?: string | null; numero?: string; anio?: number }) => {
    const label =
      expediente?.nombre ??
      [expediente?.numero, expediente?.anio].filter((part) => part !== undefined && part !== null && part !== "").join("/") ??
      `Expediente ${expediente.id}`

    setExpedienteOptions((prev) => {
      const exists = prev.some((option) => Number(option.value) === expediente.id)
      if (exists) {
        return prev.map((option) =>
          Number(option.value) === expediente.id ? { ...option, label } : option
        )
      }
      return [...prev, { value: expediente.id, label }]
    })

    setData((prev) => {
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
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seccion Resolucion */}
      {showResolucionSection && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Resolucion</h3>
          <ResolucionSection
            resolucion={data?.resolucion}
            resoluciones_tipos={resoluciones_tipos ?? []}
            expedientes={expedienteOptions}
            onResolucionChange={updateResolucion}
            errors={errors}
            onOpenNewExpediente={openExpedienteDialog}
          />
        </div>
      )}

      {/* Seccion de Datos del Convenio */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Datos del Convenio</h3>
        <ConvenioDataSection
          data={data}
          convenios_tipos={convenios_tipos}
          renovaciones_convenios_tipos={renovaciones_convenios_tipos}
          errors={errors}
          onChange={setData}
        />
      </div>

      {/* Seccion de Participantes / Relaciones */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Participantes</h3>
        <RelationsSection
          data={data}
          institucionesProps={instituciones as unknown as Option[]}
          unidadesAcademicasProps={unidades_academicas as unknown as Option[]}
          firmantesUnsaProps={firmantes_unsa as unknown as Option[]}
          onChange={setData}
          instituciones_tipos={instituciones_tipos}
          unidades_academicas_tipos={unidades_academicas_tipos}
          personas={personas}
          roles={roles}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" disabled={processing}>
          {processing
            ? convenio
              ? "Actualizando..."
              : "Creando..."
            : convenio
              ? "Actualizar Convenio"
              : "Crear Convenio"}
        </Button>
      </div>
    </form>

    {showResolucionSection && (
      <GenericDialog
          open={isExpedienteDialogOpen}
          onClose={closeExpedienteDialog}
          title="Nuevo expediente"
          size="xl"
      >
        <ExpedienteForm
            tipos={expedientes_tipos ?? []}
            dependencias={unidades_academicas ?? []}
            onSuccess={handleExpedienteCreated}
            isModal
        />
      </GenericDialog>
    )}
    </>
  )
}
