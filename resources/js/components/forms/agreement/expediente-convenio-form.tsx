import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import type { ExpedienteType } from '@/schemas/expediente-schema';
import type { DropdownOption } from '@/types';

type ExpedienteFormProps = {
  expediente?: ExpedienteType;
  tipos: DropdownOption[];
  dependencias: DropdownOption[];
  onSuccess?: (expediente: ExpedienteType) => void;
  isModal?: boolean;
};

const mergeDropdownOptions = (current: DropdownOption[], incoming: DropdownOption[] = []) => {
  const incomingMap = new Map(incoming.map(o => [o.value, o]));
  const preserved = current.filter(o => !incomingMap.has(o.value));
  return [...preserved, ...incoming];
};

const dropdownOptionsEqual = (a: DropdownOption[], b: DropdownOption[]) =>
  a.length === b.length && a.every((o, i) => o.value === b[i]?.value && o.label === b[i]?.label);

export default function ExpedienteForm({
  expediente,
  tipos = [],
  dependencias = [],
  onSuccess,
  isModal = false,
}: ExpedienteFormProps) {

  const { data, setData, post, put, processing, errors, reset } = useForm<ExpedienteType>({
    id: expediente?.id ?? 0,
    numero: expediente?.numero ?? '',
    anio: expediente?.anio ?? new Date().getFullYear(),
    tipo: expediente?.tipo ?? '',
    extracto: expediente?.extracto ?? '',
    dependencia_id: expediente?.dependencia_id ?? null,
    fecha_inicio: expediente?.fecha_inicio ?? '',
    fecha_cierre: expediente?.fecha_cierre ?? '',
    internacional: expediente?.internacional ?? false,
    observaciones: expediente?.observaciones ?? '',
    causante_dependencia_id: expediente?.causante_dependencia_id ?? null,
    causante_persona_id: expediente?.causante_persona_id ?? null,
    causante_institucion_id: expediente?.causante_institucion_id ?? null,
  });

  // Opciones locales (para inyectar los recién creados)
  const [depOptions, setDepOptions] = useState<DropdownOption[]>(dependencias ?? []);

  useEffect(() => {
    const incoming = dependencias ?? [];
    setDepOptions(prev => {
      const merged = mergeDropdownOptions(prev, incoming);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [dependencias]);

  useEffect(() => {
    if (expediente) {
      setData({
        id: expediente.id,
        numero: expediente.numero,
        anio: expediente.anio,
        tipo: expediente.tipo,
        extracto: expediente.extracto,
        dependencia_id: expediente.dependencia_id ?? null,
        fecha_inicio: expediente.fecha_inicio ?? '',
        fecha_cierre: expediente.fecha_cierre ?? '',
        internacional: expediente.internacional ?? false,
        observaciones: expediente.observaciones ?? '',
        causante_dependencia_id: expediente.causante_dependencia_id ?? null,
        causante_persona_id: expediente.causante_persona_id ?? null,
        causante_institucion_id: expediente.causante_institucion_id ?? null,
      });
    } else {
      reset();
    }
  }, [expediente, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData(name as keyof ExpedienteType, type === 'checkbox' ? (checked as any) : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isModal) {
      try {
        const res = await axios.post(route('documentos.expedientes.store'), data);
        toast.success('Expediente creado');
        onSuccess?.(res.data);
      } catch {
        toast.error('Error al crear el expediente', { description: 'Revisá los campos del formulario.' });
      }
      return;
    }

    if (expediente) {
      return put(route('documentos.expedientes.update', expediente.id), {
        onError: () =>
          toast.error('Error al actualizar el expediente', { description: 'Revisá los campos del formulario.' }),
        onSuccess: () => toast.success('Expediente actualizado'),
      });
    }

    return post(route('documentos.expedientes.store'), {
      onError: () =>
        toast.error('Error al crear el expediente', { description: 'Revisá los campos del formulario.' }),
      onSuccess: () => toast.success('Expediente creado'),
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Número y Año */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numero">Número de Expediente *</Label>
          <Input 
            id="numero" 
            name="numero" 
            placeholder="Ejemplo: 22520" 
            value={data.numero} 
            onChange={handleChange} 
            className={errors.numero ? 'border-red-500' : ''} />
          {errors.numero && <p className="mt-1 text-sm text-red-500">{errors.numero}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="anio">Año *</Label>
          <Input 
            id="anio" 
            name="anio" 
            type="number" 
            placeholder="2025" 
            value={data.anio} 
            onChange={handleChange} 
            min="1900" 
            max="2099" 
            className={errors.anio ? 'border-red-500' : ''} />
          {errors.anio && <p className="mt-1 text-sm text-red-500">{errors.anio}</p>}
        </div>
      </div>

      {/* Segunda fila: Tipo y Dependencia */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tipo de Expediente</Label>
          <ComboBox 
            options={tipos} 
            value={data.tipo ? String(data.tipo) : ''} 
            onChange={val => setData('tipo', val ? String(val) : null)} 
            placeholder="Seleccione un tipo" 
            className="w-full" />
          {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
        </div>
        <div className="space-y-2">
          <Label>Dependencia</Label>
          <ComboBox 
            options={depOptions} 
            value={data.dependencia_id ? String(data.dependencia_id) : ''} 
            onChange={val => setData('dependencia_id', val ? parseInt(val) : null)} 
            placeholder="Seleccione una dependencia" 
            className="w-full" />
          {errors.dependencia_id && <p className="mt-1 text-sm text-red-500">{errors.dependencia_id}</p>}
        </div>
      </div>

      {/* Internacional */}
      <div className="flex items-center gap-2">
        <input 
          id="internacional" 
          name="internacional" 
          type="checkbox" 
          checked={!!data.internacional} 
          onChange={handleChange} 
          className="rounded" />
        <Label htmlFor="internacional">Internacional</Label>
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b65] text-white hover:bg-[#1e5b95]" disabled={processing}>
          {expediente ? 'Actualizar Expediente' : 'Crear Expediente'}
        </Button>
      </div>
    </form>
  );
}
