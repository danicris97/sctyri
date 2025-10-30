import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { type Resolution, ResolutionFormData } from '@/types/resolution';
import { Option } from '@/types';
import { getLinkFromData, normalizeResolutionDate } from '@/helpers/resolution-helper';

type ResolutionFormProps = {
  resolution?: Resolution;
  types: Option[];
  files: Option[];
  fileId?: number | string;
  onSuccess?: (resolution: Resolution) => void;
  onSubmit?: (data: ResolutionFormData) => Promise<void> | void;
};

export default function ResolutionForm({
  resolution,
  types = [],
  files = [],
  fileId,
  onSuccess: _onSuccess,
  onSubmit,
}: ResolutionFormProps) {
  const resolvedFileId = typeof fileId === 'number' ? fileId : undefined;

  const { data, setData, processing, errors, reset } = useForm<ResolutionFormData>({
    id: resolution?.id ?? undefined,
    number: resolution?.number ?? '',
    date: normalizeResolutionDate(resolution?.date ?? ''),
    type: resolution?.type ?? '',
    link: resolution?.link ?? '',
    file_id: resolution?.file_id ?? resolvedFileId,
  });

  useEffect(() => {
    if (resolution) {
      const fallbackFileId = typeof fileId === 'number' ? fileId : undefined;
      setData({
        id: resolution.id,
        number: resolution.number ?? '',
        date: normalizeResolutionDate(resolution.date),
        type: resolution.type ?? '',
        link: resolution.link ?? '',
        file_id: resolution.file_id ?? fallbackFileId,
      });
    } else {
      reset();
    }
  }, [resolution, reset, setData, fileId]);

  useEffect(() => {
    if (typeof fileId === 'number') {
      setData('file_id', fileId);
    }
  }, [fileId, setData]);

  useEffect(() => {
    if (!data.type || !data.date || !data.number) return;
    const auto = getLinkFromData(data.type, data.date, data.number);
    const isAuto = !data.link || data.link.startsWith('https://bo.unsa.edu.ar/');
    if (isAuto) setData('link', auto);
  }, [data.type, data.date, data.number]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'number':
      case 'date':
      case 'link':
        setData(name, value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number" className="text-sm font-medium">
            Numero *
          </Label>
          <Input
            id="number"
            name="number"
            placeholder="Numero de resolucion"
            value={data.number}
            onChange={handleChange}
            className={errors.number ? 'border-red-500' : ''}
          />
          {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Fecha *
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={data.date}
            onChange={handleChange}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo *</Label>
          <ComboBox
            options={types}
            value={data.type}
            onChange={(val) => setData('type', val ?? '')}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          {typeof fileId === 'string' ? (
            <input type="hidden" name="file_id" value={fileId} />
          ) : (
            <>
              <Label className="text-sm font-medium">Expediente *</Label>
              <ComboBox
                options={files.map((exp) => ({ ...exp, value: String(exp.value) }))}
                value={data.file_id ? String(data.file_id) : ''}
                onChange={(val) => setData('file_id', val ? parseInt(val, 10) : undefined)}
                placeholder="Seleccione un expediente"
                className="w-full"
              />
            </>
          )}
          {errors.file_id && <p className="text-red-500 text-sm mt-1">{errors.file_id}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link" className="text-sm font-medium">
          Enlace (Link)
        </Label>
        <Input
          id="link"
          name="link"
          placeholder="https://bo.unsa.edu.ar/..."
          value={data.link}
          onChange={handleChange}
          className={errors.link ? 'border-red-500' : ''}
        />
        {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Se genera automaticamente (segun tipo, fecha y numero). Podes editarlo si el documento tiene otra URL.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing}
        >
          {resolution ? 'Actualizar Resolucion' : 'Crear Resolucion'}
        </Button>
      </div>
    </form>
  );
}
