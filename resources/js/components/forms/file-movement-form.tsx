import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ComboBox } from "@/components/ui/combobox"
import React, { useEffect, useMemo } from "react"
import { Option } from "@/types"
import { FileMovement, FileMovementFormData } from "@/types/file"

type FileMovementProps = {
  file_movement?: FileMovement
  files: Option[]
  dependencies: Option[]
  onSuccess?: () => void
  onSubmit?: (data: FileMovementFormData) => void
  file_id?: number //para ocultar el combobox de files si viene el id del expediente
  hideFileSelector?: boolean
}

export default function FileMovementForm({
  file_movement,
  files,
  dependencies,
  onSuccess,
  onSubmit,
  file_id,
  hideFileSelector = false,
}: FileMovementProps) {
  const resolvedFileId = typeof file_id === "number" ? file_id : undefined
  const { data, setData, processing, errors, reset } = useForm<FileMovementFormData>({
    id: file_movement?.id ?? undefined,
    file_id: file_movement?.file_id ?? resolvedFileId,
    dependency_id: file_movement?.dependency_id ?? null,
    folios: file_movement?.folios ?? null,
    date: file_movement?.date ?? "",
    purpose: file_movement?.purpose ?? "",
    observations: file_movement?.observations ?? "",
  })
  const selectedFileId = typeof file_id === "number" ? file_id : data.file_id ?? undefined
  const fileDisplay = useMemo(() => {
    if (!selectedFileId) return ""
    const match = files.find((option) => Number(option.value) === Number(selectedFileId))
    return match?.label ?? `Expediente #${selectedFileId}`
  }, [selectedFileId, files])

  useEffect(() => {
    if (file_movement) {
      setData({
        id: file_movement.id,
        file_id: file_movement.file_id ?? resolvedFileId ?? null,
        dependency_id: file_movement.dependency_id ?? null,
        folios: file_movement.folios ?? null,
        date: file_movement.date ?? "",
        purpose: file_movement.purpose ?? "",
        observations: file_movement.observations ?? "",
      })
    } else {
      reset()
    }
  }, [file_movement, file_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fila: Expediente y Dependencia destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="file_id" className="text-sm font-medium">Expediente *</Label>
          {hideFileSelector || typeof file_id === "number" ? (
            <Input id="file_id" readOnly value={fileDisplay || ""} placeholder="Expediente seleccionado" />
          ) : (
            <ComboBox
              options={files.map((e) => ({ ...e, value: String(e.value) }))}
              value={data.file_id != null ? String(data.file_id) : ""}
              onChange={(val) => setData("file_id", val ? parseInt(val, 10) : undefined)}
              placeholder="Seleccione un expediente"
              className="w-full"
            />
          )}
          {errors.file_id && <p className="text-red-500 text-sm mt-1">{errors.file_id}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Dependencia destino *</Label>
          <ComboBox
            options={dependencies.map((d) => ({ ...d, value: String(d.value) }))}
            value={data.dependency_id != null ? String(data.dependency_id) : ""}
            onChange={(val) => setData("dependency_id", val ? parseInt(val, 10) : null)}
            placeholder="Seleccione una dependencia"
            className="w-full"
          />
          {errors.dependency_id && (
            <p className="text-red-500 text-sm mt-1">{errors.dependency_id}</p>
          )}
        </div>
      </div>

      {/* Fila: fojas y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="folios" className="text-sm font-medium">folios *</Label>
          <Input 
            id="folios" 
            name="folios" 
            type="number"
            value={data.folios ?? ""} 
            onChange={(e) => {
              const { value } = e.target
              if (!value.trim()) {
                setData("folios", null)
                return
              }
              const parsed = Number(value)
              setData("folios", Number.isNaN(parsed) ? null : parsed)
            }} />
          {errors.folios && <p className="text-red-500 text-sm mt-1">{errors.folios}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">Fecha de movimiento *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={data.date ?? ""}
            onChange={(e) => setData("date", e.target.value)}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Motivo */}
      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-sm font-medium">Motivo</Label>
        <Textarea 
          id="purpose" 
          name="purpose" 
          value={data.purpose ?? ""} 
          onChange={(e) => setData("purpose", e.target.value)} 
          rows={3} />
        {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observations" className="text-sm font-medium">Observaciones</Label>
        <Textarea 
          id="observations" 
          name="observations" 
          value={data.observations ?? ""} 
          onChange={(e) => setData("observations", e.target.value)} 
          rows={3} />
        {errors.observations && <p className="text-red-500 text-sm mt-1">{errors.observations}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white" disabled={processing}>
          {data.id ? "Actualizar Movimiento" : "Crear Movimiento"}
        </Button>
      </div>
    </form>
  )
}
