import { router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import React, { useEffect, useMemo, useState } from 'react';
import { type RenovacionConvenioType } from '@/schemas/renovacion-convenio-schema';
import { toast } from 'sonner';
import { type DropdownOption } from '@/types';
import { GenericDialog } from '../ui/generic-dialog';
import ResolucionForm from './resolucion-form';
import { Plus } from 'lucide-react';
import axios from 'axios';

type RenovacionConvenioFormProps = {
  renovacionConvenio?: RenovacionConvenioType;
  convenios: DropdownOption[];
  resoluciones: { value: string; label: string }[];
  resoluciones_tipos: { value: string; label: string }[];
  expedientes: { value: string; label: string }[];
  onSuccess?: () => void;
  convenioId?: number;
  hideConvenioSelector?: boolean;
};

export default function RenovacionConvenioForm({
  renovacionConvenio,
  convenios = [],
  resoluciones = [],
  resoluciones_tipos = [],
  expedientes = [],
  onSuccess,
  convenioId,
  hideConvenioSelector = false,
}: RenovacionConvenioFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<RenovacionConvenioType>({
    id: renovacionConvenio?.id ?? 0,
    fecha_inicio: renovacionConvenio?.fecha_inicio ?? '',
    duracion: renovacionConvenio?.duracion ?? 0,
    observaciones: renovacionConvenio?.observaciones ?? '',
    fecha_fin: renovacionConvenio?.fecha_fin ?? '',
    convenio_id: renovacionConvenio?.convenio_id ?? (convenioId ?? 0),
    resolucion_id: renovacionConvenio?.resolucion_id ?? null,
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
    if (renovacionConvenio) {
      setData({
        id: renovacionConvenio.id,
        fecha_inicio: renovacionConvenio.fecha_inicio,
        duracion: renovacionConvenio.duracion,
        observaciones: renovacionConvenio.observaciones,
        fecha_fin: renovacionConvenio.fecha_fin,
        convenio_id: renovacionConvenio.convenio_id,
        resolucion_id: renovacionConvenio.resolucion_id,
      });
    } else {
      reset();
    }
  }, [renovacionConvenio, reset, setData, convenioId]);

  useEffect(() => {
    if (typeof convenioId === 'number') {
      setData('convenio_id', convenioId);
    }
  }, [convenioId, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof RenovacionConvenioType, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(convenioId){
      const action = data.id
      ? put(route("convenios.convenios.renovaciones.update", data.id), {
          onError: () => toast.error("Error al actualizar la renovacion"),
          onSuccess: () => {
            toast.success("Renovacion actualizada")
            onSuccess?.()
          },
        })
      : post(route("convenios.convenios.renovaciones.store"), {
          onError: () => toast.error("Error al crear la renovacion"),
          onSuccess: () => {
            toast.success("Renovacion creada")
            onSuccess?.()
          },
        })
      return action
    }else{
      const action = data.id
      ? put(route("convenios.renovaciones.update", data.id), {
          onError: () => toast.error("Error al actualizar la renovacion"),
          onSuccess: () => {
            toast.success("Renovacion actualizada")
            onSuccess?.()
          },
        })
      : post(route("convenios.renovaciones.store"), {
          onError: () => toast.error("Error al crear la renovacion"),
          onSuccess: () => {
            toast.success("Renovacion creada")
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
              options={convenios.map(option => ({
                ...option,
                value: String(option.value)
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

      {/* Seleccion de Resolucion */}
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

      {/* Segunda fila: Fecha Inicio y Duracion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio" className="text-sm font-medium">
            Fecha de inicio *
          </Label>
          <Input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            value={data.fecha_inicio}
            onChange={handleChange}
            className={errors.fecha_inicio ? 'border-red-500' : ''}
          />
          {errors.fecha_inicio && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fecha_inicio}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duracion" className="text-sm font-medium">
            Duracion (meses) *
          </Label>
          <Input
            id="duracion"
            name="duracion"
            type="number"
            placeholder="Duracion en meses"
            value={data.duracion}
            onChange={handleChange}
            className={errors.duracion ? 'border-red-500' : ''}
          />
          {errors.duracion && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duracion}
            </p>
          )}
        </div>
      </div>

      {/* Tercera fila: Observaciones (ancho completo) */}
      <div className="space-y-2">
        <Label htmlFor="observaciones" className="text-sm font-medium">
          Observaciones
        </Label>
        <Textarea
          id="observaciones"
          name="observaciones"
          placeholder="Ingrese observaciones adicionales sobre la renovacion..."
          value={data.observaciones || ''}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          className={errors.observaciones ? 'border-red-500' : ''}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.observaciones && (
            <p className="text-red-500 text-sm">
              {errors.observaciones}
            </p>
          )}
          <span className="text-muted-foreground text-xs">
            {data.observaciones?.length || 0}/500 caracteres
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
          {renovacionConvenio ? 'Actualizar Renovacion' : 'Crear Renovacion'}
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
