import { router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import React, { useEffect, useMemo, useState } from 'react';
import { Option } from '@/types';
import { AgreementRenewal, AgreementRenewalFormData } from '@/types/agreement';

type AgreementRenewalFormProps = {
  agreementRenewal?: AgreementRenewal;
  agreements: Option[];
  resolutions: Option[];
  resolutions_types: Option[];
  files: Option[];
  onSuccess?: () => void;
  onSubmit?: (data: AgreementRenewalFormData) => void;
  agreementId?: number;
  hideAgreementSelector?: boolean;
};

export default function AgreementRenewalForm({
  agreementRenewal,
  agreements = [],
  resolutions = [],
  resolutions_types = [],
  files = [],
  onSuccess,
  onSubmit,
  agreementId,
  hideAgreementSelector = false,
}: AgreementRenewalFormProps) {
  const resolvedAgreementId = typeof agreementId === 'number' ? agreementId : undefined;
  const { data, setData, processing, errors, reset } = useForm<AgreementRenewalFormData>({
    id: agreementRenewal?.id ?? undefined,
    start_date: agreementRenewal?.start_date ?? '',
    duration: agreementRenewal?.duration ?? null,
    observations: agreementRenewal?.observations ?? '',
    end_date: agreementRenewal?.end_date ?? '',
    agreement_id: agreementRenewal?.agreement_id ?? resolvedAgreementId ?? null,
    resolution_id: agreementRenewal?.resolution_id ?? null,
  });
  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false);
  const selectedAgreementId = typeof agreementId === 'number' ? agreementId : data.agreement_id ?? undefined;
  const agreementDisplay = useMemo(() => {
    if (!selectedAgreementId) return '';
    const match = agreements.find((option) => Number(option.value) === Number(selectedAgreementId));
    return match?.label ?? `Convenio #${selectedAgreementId}`;
  }, [selectedAgreementId, agreements]);
  const [resolutionOptions, setResolutionOptions] = useState<Option[]>(() =>
    (resolutions ?? []).map(res => ({
      ...res,
      value: String(res.value),
    }))
  );

  useEffect(() => {
    setResolutionOptions(
      (resolutions ?? []).map(res => ({
        ...res,
        value: String(res.value),
      }))
    );
  }, [resolutions]);

  useEffect(() => {
    if (agreementRenewal) {
      setData({
        id: agreementRenewal.id,
        start_date: agreementRenewal.start_date ?? '',
        duration: agreementRenewal.duration ?? null,
        observations: agreementRenewal.observations ?? '',
        end_date: agreementRenewal.end_date ?? '',
        agreement_id: agreementRenewal.agreement_id ?? resolvedAgreementId ?? null,
        resolution_id: agreementRenewal.resolution_id ?? null,
      });
    } else {
      reset();
    }
  }, [agreementRenewal, reset, setData, resolvedAgreementId]);

  useEffect(() => {
    if (typeof agreementId === 'number') {
      setData('agreement_id', agreementId);
    }
  }, [agreementId, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'duration': {
        if (!value.trim()) {
          setData('duration', null);
          break;
        }
        const parsed = Number(value);
        setData('duration', Number.isNaN(parsed) ? null : parsed);
        break;
      }
      case 'start_date':
      case 'end_date':
      case 'observations':
        setData(name as keyof AgreementRenewalFormData, value);
        break;
      default:
        setData(name as keyof AgreementRenewalFormData, value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if(onSubmit){
      await onSubmit(data);
    }
  };

  const handleResolutionSuccess = () => {
    setResolutionDialogOpen(false);
    router.reload({ only: ['resolutions'] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Convenio */}
      <div className="space-y-2">
          <Label htmlFor="agreement_id" className="text-sm font-medium">
            Convenio *
          </Label>
          {hideAgreementSelector || typeof agreementId === 'number' ? (
            <Input readOnly value={agreementDisplay || ''} placeholder="Convenio seleccionado" />
          ) : (
            <ComboBox
              options={agreements.map(option => ({
                ...option,
                value: String(option.value)
              }))}
              value={data.agreement_id != null ? String(data.agreement_id) : ''}
              onChange={(val) => setData('agreement_id', val ? parseInt(val, 10) : null)}
              placeholder="Seleccione un convenio"
              className="w-full"
            />
          )}
          {errors.agreement_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.agreement_id}
            </p>
          )}
          {(hideAgreementSelector || typeof agreementId === 'number') && !data.agreement_id && (
            <p className="text-red-500 text-sm mt-1">Seleccione un convenio</p>
          )}
      </div>

      {/* Seleccion de Resolucion */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Resolucion
        </Label>

        {errors.resolution_id && (
          <p className="text-red-500 text-sm mt-1">
            {errors.resolution_id}
          </p>
        )}
      </div>

      {/* Segunda fila: Fecha Inicio y Duracion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-sm font-medium">
            Fecha de inicio *
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={data.start_date ?? ''}
            onChange={handleChange}
            className={errors.start_date ? 'border-red-500' : ''}
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.start_date}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Duracion (meses) *
          </Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            placeholder="Duracion en meses"
            value={data.duration ?? ''}
            onChange={handleChange}
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Tercera fila: Observaciones (ancho completo) */}
      <div className="space-y-2">
        <Label htmlFor="observations" className="text-sm font-medium">
          Observaciones
        </Label>
        <Textarea
          id="observations"
          name="observations"
          placeholder="Ingrese observaciones adicionales sobre la renovacion..."
          value={data.observations || ''}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          className={errors.observations ? 'border-red-500' : ''}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.observations && (
            <p className="text-red-500 text-sm">
              {errors.observations}
            </p>
          )}
          <span className="text-muted-foreground text-xs">
            {data.observations?.length || 0}/500 caracteres
          </span>
        </div>
      </div>

      {/* Boton de submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing}
        >
          {agreementRenewal ? 'Actualizar Renovacion' : 'Crear Renovacion'}
        </Button>
      </div>
    </form>
  );
}
