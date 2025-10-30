import type React from "react"
import { useForm } from "@inertiajs/react"
import { useEffect } from "react"
import { AgreementFormData } from "@/types/agreement"

type UseAgreementFormProps = {
  agreement?: AgreementFormData
  onSubmit?: (data: AgreementFormData) => Promise<void>
}

export function useAgreementForm({ agreement, onSubmit }: UseAgreementFormProps) {
  const { data, setData, post, put, processing, errors, reset, transform } = useForm<AgreementFormData>({
    id: agreement?.id || undefined,
    type: agreement?.type || "",
    date_signature: agreement?.date_signature || "",
    duration: agreement?.duration || 0,
    type_renewal: agreement?.type_renewal || "",
    international: agreement?.international || false,
    resolution_id: agreement?.resolution_id || null,
    object: agreement?.object || null,
    summary: agreement?.summary || null,
    observations: agreement?.observations || null,
    resolution: agreement?.resolution
      ? {
          id: agreement?.resolution.id || undefined,
          number: agreement?.resolution.number || undefined,
          date: agreement?.resolution.date || undefined,
          type: agreement?.resolution.type || undefined,
          link: agreement?.resolution.link || undefined,
          file_id: agreement?.resolution.file_id || undefined,
        }
      : undefined,
    institutions: agreement?.institutions || [],
    dependencies: agreement?.dependencies || [],
    person_positions: agreement?.person_positions || [],
  })

  useEffect(() => {
    if (agreement) {
      setData({
        id: agreement.id,
        type: agreement.type,
        date_signature: agreement.date_signature,
        duration: agreement.duration,
        type_renewal: agreement.type_renewal,
        international: agreement.international,
        resolution_id: agreement.resolution?.id || null,
        resolution: agreement.resolution,
        object: agreement.object,
        summary: agreement.summary,
        observations: agreement.observations,
        institutions: agreement.institutions,
        dependencies: agreement.dependencies,
        person_positions: agreement.person_positions,
      } as any)
    } else {
      reset()
    }
  }, [agreement, reset, setData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onSubmit){
      await onSubmit(data)
    }
  }

  return {
    data,
    setData,
    processing,
    errors,
    handleSubmit,
  }
}
