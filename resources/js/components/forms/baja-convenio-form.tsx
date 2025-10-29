import { router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { GenericDialog } from '../ui/generic-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { type BajaConvenioType } from '@/schemas/baja-convenio-schema';
import { type DropdownOption } from '@/types';
import ResolucionForm from './resolucion-form';
import { Plus } from 'lucide-react';
import axios from 'axios';

type BajaConvenioFormProps = {
  baja_convenio?: BajaConvenioType;
  convenios: DropdownOption[];
  resoluciones: DropdownOption[];
  resoluciones_tipos: { value: string; label: string }[];
  expedientes: { value: string; label: string }[];
  onSuccess?: () => void;
  convenioId?: number;
  hideConvenioSelector?: boolean;
};

export default function BajaConvenioForm({
  baja_convenio,
  convenios = [],
  resoluciones = [],
  resoluciones_tipos = [],
  expedientes = [],
  onSuccess,
  convenioId,
  hideConvenioSelector = false,
}: BajaConvenioFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<BajaConvenioType>({
    id: baja_convenio?.id ?? 0,
    fecha_baja: baja_convenio?.fecha_baja ?? '',
    motivo: baja_convenio?.motivo ?? '',
    convenio_id: baja_convenio?.convenio_id ?? (convenioId ?? 0),
    resolucion_id: baja_convenio?.resolucion_id ?? null,
  });

  const [resolucionDialogOpen, setResolucionDialogOpen] = useState(false);
  const selectedConvenioId = typeof convenioId === 'number' ? convenioId : data.convenio_id;
  const convenioDisplay = useMemo(() => {
    if (!selectedConvenioId) return '';
    const match = convenios.find((option) => Number(option.value) === Number(selectedConvenioId));
    return match?.label ?? `Convenio #${selectedConvenioId}`;
  }, [selectedConvenioId, convenios]);
  const [resolucionOptions, setResolucionOptions] = useState<DropdownOption[]>(() =>
    (resoluciones ?? []).map(res => ({
      ...res,
      value: String(res.value),
    }))
  );

  useEffect(() => {
    setResolucionOptions(
      (resoluciones ?? []).map(res => ({
        ...res,
        value: String(res.value),
      }))
    );
  }, [resoluciones]);

  useEffect(() => {
    if (baja_convenio) {
      setData({
        id: baja_convenio.id,
        fecha_baja: baja_convenio.fecha_baja,
        motivo: baja_convenio.motivo,
        convenio_id: baja_convenio.convenio_id,
        resolucion_id: baja_convenio.resolucion_id,
      });
    } else {
      reset();
    }
  }, [baja_convenio, reset, setData, convenioId]);

  useEffect(() => {
    if (typeof convenioId === 'number') {
      setData('convenio_id', convenioId);
    }
  }, [convenioId, setData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof BajaConvenioType, value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if(convenioId){
      const action = data.id
      ? put(route("convenios.convenios.bajas.update", data.id), {
          onError: () => toast.error("Error al actualizar la baja"),
          onSuccess: () => {
            toast.success("Baja actualizada")
            onSuccess?.()
          },
        })
      : post(route("convenios.convenios.bajas.store"), {
          onError: () => toast.error("Error al crear la baja"),
          onSuccess: () => {
            toast.success("Baja creada")
            onSuccess?.()
          },
        })
      return action
    }else{
      const action = data.id
      ? put(route("convenios.bajas.update", data.id), {
          onError: () => toast.error("Error al actualizar la baja"),
          onSuccess: () => {
            toast.success("Baja actualizada")
            onSuccess?.()
          },
        })
      : post(route("convenios.bajas.store"), {
          onError: () => toast.error("Error al crear la baja"),
          onSuccess: () => {
            toast.success("Baja creada")
            onSuccess?.()
          },
        })
      return action
    }
  };

  const handleResolucionSuccess = () => {
    setResolucionDialogOpen(false);
    router.reload({ only: ['resoluciones'] });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Convenio */}
      <div className="space-y-2">
        <Label htmlFor="convenio_id" className="text-sm font-medium">
          Convenio *
        </Label>
        {hideConvenioSelector || typeof convenioId === 'number' ? (
          <Input readOnly value={convenioDisplay || ''} placeholder="Convenio seleccionado" />
        ) : (
          <ComboBox
            options={convenios.map(con => ({
              ...con,
              value: String(con.value)
            }))}
            value={data.convenio_id ? String(data.convenio_id) : ''}
            onChange={(val) => setData('convenio_id', val ? parseInt(val, 10) : 0)}
            placeholder="Seleccione un convenio"
            className="w-full"
          />
        )}
        {errors.convenio_id && (
          <p className="text-red-500 text-sm mt-1">
            {errors.convenio_id}
          </p>
        )}
        {(hideConvenioSelector || typeof convenioId === 'number') && !data.convenio_id && (
          <p className="text-red-500 text-sm mt-1">Seleccione un convenio</p>
        )}
      </div>

      {/* Segunda fila: Resolucion */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Resolucion
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ComboBox
            options={resolucionOptions}
            value={data.resolucion_id ? String(data.resolucion_id) : ''}
            onChange={(val) => {
              const parsed = val ? Number(val) : null;
              setData('resolucion_id', parsed !== null && !Number.isNaN(parsed) ? parsed : null);
            }}
            placeholder="Seleccione una resolucion"
            className="w-full sm:flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setResolucionDialogOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva
          </Button>
        </div>
        {errors.resolucion_id && (
          <p className="text-red-500 text-sm mt-1">
            {errors.resolucion_id}
          </p>
        )}
      </div>

      {/* Tercera fila: Fecha de baja */}
      <div className="space-y-2">
        <Label htmlFor="fecha_baja" className="text-sm font-medium">
          Fecha de baja *
        </Label>
        <Input
          id="fecha_baja"
          name="fecha_baja"
          type="date"
          value={data.fecha_baja}
          onChange={handleChange}
          className={errors.fecha_baja ? 'border-red-500' : ''}
        />
        {errors.fecha_baja && (
          <p className="text-red-500 text-sm mt-1">
            {errors.fecha_baja}
          </p>
        )}
      </div>

      {/* Tercera fila: Motivo */}
      <div className="md:col-span-1 space-y-2">
        <Label htmlFor="motivo" className="text-sm font-medium">Motivo</Label>
        <Textarea
          id="motivo"
          placeholder="Notas adicionales, aclaraciones..."
          value={data.motivo || ''}
          onChange={(e) => setData('motivo', e.target.value)}
          rows={4}
          maxLength={255}
          className={errors.motivo ? 'border-red-500' : ''}
        />
        {errors.motivo && <p className="text-red-500 text-sm">{errors.motivo}</p>}
        <div className="flex justify-end mt-1">
          <span className="text-muted-foreground text-xs">
            {data.motivo?.length || 0}/255 caracteres
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
          {baja_convenio ? 'Actualizar Baja' : 'Crear Baja'}
        </Button>
      </div>
    </form>

    <GenericDialog
      open={resolucionDialogOpen}
      onClose={() => setResolucionDialogOpen(false)}
      title="Nueva Resolucion"
      size="xl"
      >
      <ResolucionForm
        resoluciones_tipos={resoluciones_tipos}
        expedientes={expedientes}
        onSuccess={handleResolucionSuccess}
        onSubmit={async (payload, { setProcessing, setFieldErrors, reset }) => {
          try {
            setProcessing(true);
            setFieldErrors({});
    
            // IMPORTANTE: Accept JSON para recibir respuesta JSON del backend
            const { data: created } = await axios.post(
              route('documentos.resoluciones.store'),
              payload,
              { headers: { Accept: 'application/json' } }
            );
    
            // Seteamos la resolucion recien creada en el form padre
            if (created?.id) {
              const option = {
                value: String(created.id),
                label:
                  created?.numero_anio ??
                  (created?.numero && created?.fecha
                    ? `${created.numero} - ${new Date(created.fecha).getFullYear()}`
                    : `Resolucion ${created.id}`),
              };
              setResolucionOptions(prev => {
                if (prev.some(item => item.value === option.value)) {
                  return prev;
                }
                return [...prev, option];
              });
              setData('resolucion_id', Number(created.id));
            }

            toast.success('Resolucion creada');
            reset();
            handleResolucionSuccess();
          } catch (err: any) {
            const status = err?.response?.status;
            if (status === 422 && err.response?.data?.errors) {
              // errores de validación del backend
              const flat: Record<string, string> = {};
              Object.entries(err.response.data.errors).forEach(([k, v]) => {
                flat[k] = Array.isArray(v) ? v[0] : String(v);
              });
              setFieldErrors(flat);
              toast.error('Revisá los campos del formulario');
            } else {
              toast.error('Error al crear la resolución', {
                description: err?.response?.data?.message ?? 'Intentalo nuevamente',
              });
            }
          } finally {
            setProcessing(false);
          }
        }}
      />
    </GenericDialog>
    </>
  );
}
