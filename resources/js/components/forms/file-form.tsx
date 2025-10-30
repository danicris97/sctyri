import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { File, FileFormData } from '@/types/file';
import type { Option } from '@/types';

type FileFormProps = {
  file?: File;
  types: Option[];
  dependencies_types?: Option[];
  dependencies: Option[];
  institutions_types?: Option[];
  institutions: Option[];
  persons: Option[];
  positions?: Option[];
  person_positions?: Option[];
  onSuccess?: (file: File) => void;
  onSubmit?: (data: FileFormData) => void;
};

export default function FileForm({
  file,
  types = [],
  dependencies_types = [],
  dependencies = [],
  institutions_types = [],
  institutions = [],
  persons = [],
  positions = [],
  person_positions = [],
  onSubmit,
  onSuccess,
}: FileFormProps) {

  const { data, setData, post, put, processing, errors, reset } = useForm<FileFormData>({
    id: file?.id ?? undefined,
    number: file?.number ?? '',
    year: file?.year ?? new Date().getFullYear(),
    type: file?.type ?? '',
    statement: file?.statement ?? '',
    causative_id: file?.causative_id ?? undefined,
    causative_type: file?.causative_type ?? '',
    dependency_id: file?.dependency_id ?? undefined,
    opening_date: file?.opening_date ?? undefined,
    closing_date: file?.closing_date ?? undefined,
    international: file?.international ?? false,
    observations: file?.observations ?? '',
  });

  useEffect(() => {
    if (file) {
      setData({
        number: file.number,
        year: file.year,
        type: file.type,
        statement: file.statement,
        causative_id: file.causative_id ?? null,
        causative_type: file.causative_type ?? '',
        dependency_id: file.dependency_id ?? null,
        opening_date: file.opening_date ?? '',
        closing_date: file.closing_date ?? null,
        international: file.international ?? false,
        observations: file.observations ?? '',
      });
    } else {
      reset();
    }
  }, [file, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData(name as keyof FileFormData, type === 'checkbox' ? (checked as any) : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if(onSubmit){
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Número y Año */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number">Número de file *</Label>
          <Input 
            id="number" 
            name="number" 
            placeholder="Ejemplo: 22520" 
            value={data.number} 
            onChange={handleChange} 
            className={errors.number ? 'border-red-500' : ''} />
          {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Año *</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            placeholder="2025" 
            value={data.year} 
            onChange={handleChange} 
            min="1900" 
            max="2099" 
            className={errors.year ? 'border-red-500' : ''} />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
        </div>
      </div>

      {/* Segunda fila: Tipo y Dependencia */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de file</Label>
          <ComboBox 
            options={types} 
            value={data.type ? String(data.type) : ''} 
            onChange={val => setData('type', val ? String(val) : '')} 
            placeholder="Seleccione un tipo" 
            className="w-full" />
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dependency_id">Dependencia</Label>
          <ComboBox 
            options={dependencies} 
            value={data.dependency_id ? String(data.dependency_id) : ''} 
            onChange={val => setData('dependency_id', val ? parseInt(val) : undefined)} 
            placeholder="Seleccione una dependencia" 
            className="w-full" />
          {errors.dependency_id && <p className="mt-1 text-sm text-red-500">{errors.dependency_id}</p>}
        </div>
      </div>

      {/* Extracto */}
      <div className="space-y-2">
        <Label htmlFor="statement">Extracto del file</Label>
        <Textarea 
          id="statement" 
          name="statement" 
          placeholder="Descripción breve..." 
          value={data.statement || ''} onChange={e => setData('statement', e.target.value)} 
          rows={4} 
          maxLength={255} 
          className={errors.statement ? 'border-red-500' : ''} />
        <div className="mt-1 flex items-center justify-between">
          {errors.statement && <p className="text-sm text-red-500">{errors.statement}</p>}
          <span className="text-xs text-muted-foreground">{data.statement?.length || 0}/255 caracteres</span>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="opening_date">Fecha de Inicio</Label>
          <Input 
            id="opening_date" 
            name="opening_date" 
            type="date" 
            value={data.opening_date || ''} 
            onChange={handleChange} 
            className={errors.opening_date ? 'border-red-500' : ''} />
          {errors.opening_date && <p className="mt-1 text-sm text-red-500">{errors.opening_date}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="closing_date">Fecha de Cierre</Label>
          <Input 
            id="closing_date" 
            name="closing_date" 
            type="date" 
            value={data.closing_date || ''} 
            onChange={handleChange} 
            min={data.opening_date || undefined} 
            className={errors.closing_date ? 'border-red-500' : ''} />
          {errors.closing_date && <p className="mt-1 text-sm text-red-500">{errors.closing_date}</p>}
        </div>
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones</Label>
        <Textarea 
          id="observations" 
          name="observations" 
          placeholder="Observaciones del file..." 
          value={data.observations || ''} 
          onChange={e => setData('observations', e.target.value)} 
          rows={4} 
          maxLength={255} 
          className={errors.observations ? 'border-red-500' : ''} />
        <div className="mt-1 flex items-center justify-between">
          {errors.observations && <p className="text-sm text-red-500">{errors.observations}</p>}
          <span className="text-xs text-muted-foreground">{data.observations?.length || 0}/255 caracteres</span>
        </div>
      </div>

      {/* Internacional */}
      <div className="flex items-center gap-2">
        <input 
          id="international" 
          name="international" 
          type="checkbox" 
          checked={!!data.international} 
          onChange={handleChange} 
          className="rounded" />
        <Label htmlFor="international">Internacional</Label>
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-[#0e3b65] text-white hover:bg-[#1e5b95]" disabled={processing}>
          {file ? 'Actualizar file' : 'Crear file'}
        </Button>
      </div>

    </form>
  );
}
