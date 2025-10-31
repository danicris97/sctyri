import { router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Option } from '@/types';
import { AgreementCancellation, AgreementCancellationFormData } from '@/types/agreement';

type AgreementCancellationFormProps = {
  agreement_cancellation?: AgreementCancellation;
  agreements: Option[];
  resolutions: Option[];
  resolution_types: Option[];
  files: Option[];
  onSuccess?: () => void;
  onSubmit?: (data: AgreementCancellationFormData) => void;
  agreementId?: number;
  hideAgreementSelector?: boolean;
};

export default function AgreementCancellationForm({
  agreement_cancellation,
  agreements = [],
  resolutions = [],
  resolution_types = [],
  files = [],
  onSuccess,
  onSubmit,
  agreementId,
  hideAgreementSelector = false,
}: AgreementCancellationFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<AgreementCancellationFormData>({
    id: agreement_cancellation?.id ?? undefined,
    reason: agreement_cancellation?.reason ?? '',
    cancellation_date: agreement_cancellation?.cancellation_date ?? '',
    agreement_id: agreement_cancellation?.agreement_id ?? (agreementId ?? 0),
    resolution_id: agreement_cancellation?.resolution_id ?? null,
  });

  const [resolucionDialogOpen, setResolucionDialogOpen] = useState(false);
  const selectedAgreementId = typeof agreementId === 'number' ? agreementId : data.agreement_id;
  const agreementDisplay = useMemo(() => {
    if (!selectedAgreementId) return '';
    const match = agreements.find((option) => Number(option.value) === Number(selectedAgreementId));
    return match?.label ?? `Convenio #${selectedAgreementId}`;
  }, [selectedAgreementId, agreements]);
  const [resolucionOptions, setResolucionOptions] = useState<Option[]>(() =>
    (resolutions ?? []).map(res => ({
      ...res,
      value: String(res.value),
    }))
  );

  useEffect(() => {
    setResolucionOptions(
      (resolutions ?? []).map(res => ({
        ...res,
        value: String(res.value),
      }))
    );
  }, [resolutions]);

  useEffect(() => {
    if (agreement_cancellation) {
      setData({
        id: agreement_cancellation.id,
        reason: agreement_cancellation.reason,
        cancellation_date: agreement_cancellation.cancellation_date,
        agreement_id: agreement_cancellation.agreement_id,
        resolution_id: agreement_cancellation.resolution_id,
      });
    } else {
      reset();
    }
  }, [agreement_cancellation, reset, setData]);

  useEffect(() => {
    if (typeof agreementId === 'number') {
      setData('agreement_id', agreementId);
    }
  }, [agreementId, setData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof AgreementCancellationFormData, value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if(onSubmit){
      await onSubmit(data); 
    }
  };

  const handleResolucionSuccess = () => {
    setResolucionDialogOpen(false);
    router.reload({ only: ['resoluciones'] });
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
            options={agreements.map(agreement => ({
              ...agreement,
              value: String(agreement.value)
            }))}
            value={data.agreement_id ? String(data.agreement_id) : ''}
            onChange={(val) => setData('agreement_id', val ? parseInt(val, 10) : 0)}
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

      {/* Segunda fila: Resolucion */}
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

      {/* Tercera fila: Fecha de baja */}
      <div className="space-y-2">
        <Label htmlFor="cancellation_date" className="text-sm font-medium">
          Fecha de baja *
        </Label>
        <Input
          id="cancellation_date"
          name="cancellation_date"
          type="date"
          value={data.cancellation_date}
          onChange={handleChange}
          className={errors.cancellation_date ? 'border-red-500' : ''}
        />
        {errors.cancellation_date && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cancellation_date}
          </p>
        )}
      </div>

      {/* Tercera fila: Motivo */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="reason" className="text-sm font-medium">Motivo</Label>
        <Textarea
          id="reason"
          placeholder="Notas adicionales, aclaraciones..."
          value={data.reason || ''}
          onChange={(e) => setData('reason', e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.reason ? 'border-red-500' : ''}
        />
        {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
        <div className="flex justify-end mt-1">
          <span className="text-muted-foreground text-xs">
            {data.reason?.length || 0}/255 caracteres
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
          {agreement_cancellation ? 'Actualizar Baja' : 'Crear Baja'}
        </Button>
      </div>
    </form>
  );
}
