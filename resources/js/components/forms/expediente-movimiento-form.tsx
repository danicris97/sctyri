import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ComboBox } from "@/components/ui/combobox"
import React, { useEffect, useMemo } from "react"
import { toast } from "sonner"

type Dropdown = { value: string; label: string }

type ExpedienteMovimientoType = {
  id: number
  expediente_id: number | null
  dependencia_destino_id: number | null
  fojas: string
  fecha_movimiento: string
  motivo: string | null
  observaciones: string | null
}

type Props = {
  movimiento?: Partial<ExpedienteMovimientoType>
  expedientes: Dropdown[]
  dependencias: Dropdown[]
  onSuccess?: () => void
  expedienteId?: number // si viene, oculta combo y fija el valor
  hideExpedienteSelector?: boolean
}

export default function ExpedienteMovimientoForm({
  movimiento,
  expedientes = [],
  dependencias = [],
  onSuccess,
  expedienteId,
  hideExpedienteSelector = false,
}: Props) {
  const { data, setData, post, put, processing, errors, reset } = useForm<ExpedienteMovimientoType>({
    id: movimiento?.id ?? 0,
    expediente_id: movimiento?.expediente_id ?? (expedienteId ?? null),
    dependencia_destino_id: movimiento?.dependencia_destino_id ?? null,
    fojas: movimiento?.fojas ?? "",
    fecha_movimiento: movimiento?.fecha_movimiento ?? "",
    motivo: movimiento?.motivo ?? "",
    observaciones: movimiento?.observaciones ?? "",
  })
  const selectedExpedienteId = typeof expedienteId === "number" ? expedienteId : data.expediente_id
  const expedienteDisplay = useMemo(() => {
    if (!selectedExpedienteId) return ""
    const match = expedientes.find((option) => Number(option.value) === Number(selectedExpedienteId))
    return match?.label ?? `Expediente #${selectedExpedienteId}`
  }, [selectedExpedienteId, expedientes])

  useEffect(() => {
    if (movimiento?.id) {
      setData({
        id: movimiento.id!,
        expediente_id: movimiento.expediente_id ?? (expedienteId ?? null),
        dependencia_destino_id: movimiento.dependencia_destino_id ?? null,
        fojas: movimiento.fojas ?? "",
        fecha_movimiento: movimiento.fecha_movimiento ?? "",
        motivo: movimiento.motivo ?? "",
        observaciones: movimiento.observaciones ?? "",
      })
    } else {
      reset((prev) => ({ ...prev, expediente_id: expedienteId ?? prev.expediente_id }))
    }
  }, [movimiento, expedienteId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(expedienteId){
      const action = data.id
      ? put(route("documentos.movimientos.update", data.id), {
          onError: () => toast.error("Error al actualizar el movimiento"),
          onSuccess: () => {
            toast.success("Movimiento actualizado")
            onSuccess?.()
          },
        })
      : post(route("documentos.expedientes.movimientos.store"), {
          onError: () => toast.error("Error al crear el movimiento"),
          onSuccess: () => {
            toast.success("Movimiento creado")
            onSuccess?.()
          },
        })
      return action
    }else{
      const action = data.id
      ? put(route("documentos.movimientos.update", data.id), {
          onError: () => toast.error("Error al actualizar el movimiento"),
          onSuccess: () => {
            toast.success("Movimiento actualizado")
            onSuccess?.()
          },
        })
      : post(route("documentos.movimientos.store"), {
          onError: () => toast.error("Error al crear el movimiento"),
          onSuccess: () => {
            toast.success("Movimiento creado")
            onSuccess?.()
          },
        })
      return action
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Fila: Expediente y Dependencia destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expediente_id" className="text-sm font-medium">Expediente *</Label>
          {hideExpedienteSelector || typeof expedienteId === "number" ? (
            <Input id="expediente_id" readOnly value={expedienteDisplay || ""} placeholder="Expediente seleccionado" />
          ) : (
            <ComboBox
              options={expedientes.map((e) => ({ ...e, value: String(e.value) }))}
              value={data.expediente_id ? String(data.expediente_id) : ""}
              onChange={(val) => setData("expediente_id", val ? parseInt(val, 10) : null)}
              placeholder="Seleccione un expediente"
              className="w-full"
            />
          )}
          {errors.expediente_id && <p className="text-red-500 text-sm mt-1">{errors.expediente_id}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Dependencia destino *</Label>
          <ComboBox
            options={dependencias.map((d) => ({ ...d, value: String(d.value) }))}
            value={data.dependencia_destino_id ? String(data.dependencia_destino_id) : ""}
            onChange={(val) => setData("dependencia_destino_id", val ? parseInt(val) : null)}
            placeholder="Seleccione una dependencia"
            className="w-full"
          />
          {errors.dependencia_destino_id && (
            <p className="text-red-500 text-sm mt-1">{errors.dependencia_destino_id}</p>
          )}
        </div>
      </div>

      {/* Fila: fojas y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fojas" className="text-sm font-medium">Fojas *</Label>
          <Input id="fojas" name="fojas" value={data.fojas} onChange={(e) => setData("fojas", e.target.value)} />
          {errors.fojas && <p className="text-red-500 text-sm mt-1">{errors.fojas}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_movimiento" className="text-sm font-medium">Fecha de movimiento *</Label>
          <Input
            id="fecha_movimiento"
            name="fecha_movimiento"
            type="date"
            value={data.fecha_movimiento}
            onChange={(e) => setData("fecha_movimiento", e.target.value)}
            className={errors.fecha_movimiento ? "border-red-500" : ""}
          />
          {errors.fecha_movimiento && <p className="text-red-500 text-sm mt-1">{errors.fecha_movimiento}</p>}
        </div>
      </div>

      {/* Motivo */}
      <div className="space-y-2">
        <Label htmlFor="motivo" className="text-sm font-medium">Motivo</Label>
        <Textarea id="motivo" name="motivo" value={data.motivo ?? ""} onChange={(e) => setData("motivo", e.target.value)} rows={3} />
        {errors.motivo && <p className="text-red-500 text-sm mt-1">{errors.motivo}</p>}
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones" className="text-sm font-medium">Observaciones</Label>
        <Textarea id="observaciones" name="observaciones" value={data.observaciones ?? ""} onChange={(e) => setData("observaciones", e.target.value)} rows={3} />
        {errors.observaciones && <p className="text-red-500 text-sm mt-1">{errors.observaciones}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white" disabled={processing}>
          {data.id ? "Actualizar Movimiento" : "Crear Movimiento"}
        </Button>
      </div>
    </form>
  )
}
