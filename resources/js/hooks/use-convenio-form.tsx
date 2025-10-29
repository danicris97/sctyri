import type React from "react"
import { useForm } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "sonner"
import type { ConvenioFullType } from "@/schemas/convenio-schema"
import type { ResolucionFullType } from "@/schemas/resolucion-schema"

type UseConvenioFormProps = {
  convenio?: ConvenioFullType
}

export function useConvenioForm({ convenio }: UseConvenioFormProps) {
  const { data, setData, post, put, processing, errors, reset, transform } = useForm<ConvenioFullType>({
    id: convenio?.id || 0,
    tipo_convenio: convenio?.tipo_convenio || "",
    titulo: convenio?.titulo || null,
    fecha_firma: convenio?.fecha_firma || "",
    duracion: convenio?.duracion || 0,
    tipo_renovacion: convenio?.tipo_renovacion || "",
    internacional: convenio?.internacional || false,
    resolucion_id: convenio?.resolucion_id || null,
    objeto: convenio?.objeto || null,
    observaciones: convenio?.observaciones || null,
    resolucion: convenio?.resolucion
      ? {
          ...convenio.resolucion,
          expediente: convenio.resolucion.expediente ? { ...convenio.resolucion.expediente } : undefined,
        }
      : undefined,
    dependencias_unsa: convenio?.dependencias_unsa || [],
    firmantes_unsa: convenio?.firmantes_unsa || [],
    instituciones: convenio?.instituciones || [],
    fecha_fin: convenio?.fecha_fin || undefined,
  })

  useEffect(() => {
    if (convenio) {
      setData({
        id: convenio.id,
        tipo_convenio: convenio.tipo_convenio,
        titulo: convenio.titulo,
        fecha_firma: convenio.fecha_firma,
        duracion: convenio.duracion,
        tipo_renovacion: convenio.tipo_renovacion,
        internacional: convenio.internacional,
        resolucion_id: convenio.resolucion_id,
        objeto: convenio.objeto,
        observaciones: convenio.observaciones,
        instituciones: convenio.instituciones,
        dependencias_unsa: convenio.dependencias_unsa,
        firmantes_unsa: convenio.firmantes_unsa,
        fecha_fin: convenio.fecha_fin,
      } as any)
    } else {
      reset()
    }
  }, [convenio, reset, setData])

  const updateResolucion = (key: keyof ResolucionFullType, value: any) => {
    const empty = {
      id: null,
      numero: "",
      fecha: "",
      tipo: null,
      link: null,
      expediente_id: null,
      expediente: null,
    } as unknown as ResolucionFullType

    setData("resolucion", {
      ...(data.resolucion ?? empty),
      [key]: value,
    } as ResolucionFullType)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = { ...data } as any

    if (!data.resolucion?.numero || !data.resolucion?.fecha) {
      payload.resolucion = null
    }

    if (payload.resolucion) {
      if (!payload.resolucion.id) {
        payload.resolucion.id = null as any
      }
      if (payload.resolucion.expediente_id == null || payload.resolucion.expediente_id === "") {
        payload.resolucion.expediente_id = null
      }
    }

    const resetTransform = () => transform((formData) => formData)

    transform(() => payload)

    return (data.id
      ? put(route("convenios.convenios.update", data.id), {
          onError: (errs: any) => {
            console.log("Errores de validación:", errs)
            toast.error("Error al actualizar el convenio", {
              description: "Revisá los campos del formulario.",
            })
          },
          onSuccess: () => toast.success("Convenio actualizado"),
          onFinish: resetTransform,
        })
      : post(route("convenios.convenios.store"), {
          onError: (errs: any) => {
            console.log("Errores de validación:", errs)
            toast.error("Error al crear el convenio", {
              description: "Revisá los campos del formulario.",
            })
          },
          onSuccess: () => toast.success("Convenio creado"),
          onFinish: resetTransform,
        }))
  }

  return {
    data,
    setData,
    processing,
    errors,
    updateResolucion,
    handleSubmit,
  }
}
