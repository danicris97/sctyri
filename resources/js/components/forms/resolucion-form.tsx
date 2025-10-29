import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import React, { useEffect, useMemo, useState } from 'react';
import { type ResolucionType } from '@/schemas/resolucion-schema';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

type ResolucionFormProps = {
  resolucion?: ResolucionType;
  resoluciones_tipos: { value: string; label: string }[];
  expedientes: { value: string; label: string }[];
  expedienteId?: number;
  onSuccess?: () => void;

  /** NUEVO: si se envía, se usa este submit en lugar de Inertia */
  onSubmit?: (
    payload: ResolucionType,
    helpers: {
      setProcessing: (v: boolean) => void;
      setFieldErrors: (errs: Record<string, string>) => void;
      reset: () => void;
    }
  ) => Promise<void> | void;
};

/** === Helpers compartidos con la sección === */
const pad = (n: string | number, len = 4) => String(n ?? "").replace(/\D/g, "").padStart(len, "0");
const yy = (y: number) => String(y).slice(-2);

function filenameByTipo(tipo: string, year: number, numero: string) {
  const NUM3 = pad(numero, 3);
  const NUM4 = pad(numero, 4);
  const map: Record<string, string | ((y: number, num: string) => string)> = {
    CS: (y, _) => `R-CS-${y}-${NUM3}.pdf`,
    DR: (y, _) => `R-DR-${y}-${NUM4}.${y >= 1999 && y <= 2009 ? "html" : "pdf"}`,
    CDEX: (y, _) => `RCD-${NUM3}-${y}-EXA-UNSa.pdf`,
    DEX: (y, _) => `RD-${NUM3}-${y}-EXA-UNSa.pdf`,
    CDNAT: (y, _) => `R-CDNAT-${y}-${NUM4}.pdf`,
    DNAT: (y, _) => `R-DNAT-${y}-${NUM4}.pdf`,
    CDECO: (y, _) => `R-CDECO-${y}-${NUM4}.pdf`,
    DECO: (y, _) => `R-DECO-${y}-${NUM4}.pdf`,
    CDSALUD: (y, _) => `CDSALUD-${y}-${NUM3}.pdf`,
    CDH: (y, _) => `Res._${NUM4}_${yy(y)}.pdf`,
    DH: (y, _) => `Res._${NUM4}_${yy(y)}.pdf`,
    CDING: (y, _) => `R-CDI-${y}-${NUM4}.pdf`,
    DING: (y, _) => `R-DING-${y}-${NUM4}.pdf`,
    CDFRO: (y, _) => `Res.CA-SO-${NUM3}-${y}.pdf`,
    DFRO: (y, _) => `Res.${NUM3}-${y}.pdf`,
    SRO: (y, _) => `Res.${NUM3}-${y}.pdf`,
    CDFRMT: (y, _) => `R-CDFRMT-SES-UNSA-${y}-${NUM4}.pdf`,
    DFRMT: (y, _) => `R-FRMT-SES-UNSA-${y}-${NUM4}.pdf`,
    SRTCA: (y, _) => `R-CASRT-SES-UNSA-${y}-${NUM4}.pdf`,
    SRT: (y, _) => `R-SRT-SES-UNSA-${y}-${NUM4}.pdf`,
    IEMT: (y, _) => `R-IEMTAR-${y}-${NUM4}.pdf`,
    SRMRF: (y, _) => `R-SRS-${y}-${NUM3}.pdf`,
    CCI: (y, _) => `R-CCI-${y}-${NUM4}.pdf`,
    CI: (y, _) => `R-CI-${y}-${NUM4}.pdf`,
  };

  const k = (tipo ?? "").toUpperCase();
  const def = (y: number) => `R-${k}-${y}-${NUM4}.pdf`;
  const builder = map[k];
  return typeof builder === "function" ? builder(year, numero) : (builder ?? def(year));
}

const getLinkFromData = (tipo: string | null, fecha: string | null, numero: string | null) => {
  if (!tipo || !fecha || !numero) return "";
  const year = new Date(fecha).getFullYear();
  const base = "https://bo.unsa.edu.ar";
  const folder = (tipo ?? "").toLowerCase();
  const file = filenameByTipo(tipo, year, numero);
  return `${base}/${folder}/R${year}/${file}`;
};

export default function ResolucionForm({
  resolucion,
  resoluciones_tipos = [],
  expedientes = [],
  onSuccess,
  expedienteId,
  onSubmit, // NUEVO
}: ResolucionFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<ResolucionType>({
    id: resolucion?.id ?? 0,
    numero: resolucion?.numero ?? '',
    fecha: resolucion?.fecha ?? '',
    tipo: resolucion?.tipo ?? '',
    link: resolucion?.link ?? '',
    expediente_id: resolucion?.expediente_id ?? expedienteId ?? null,
  });

  // Soporte a submit custom: estados locales para UX/errores
  const [customProcessing, setCustomProcessing] = useState(false);
  const [customErrors, setCustomErrors] = useState<Record<string, string>>({});

  const fieldErrors = useMemo(() => {
    // si hay errores de Inertia, priorizalos; si no, los locales
    return Object.keys(errors || {}).length ? (errors as Record<string,string>) : customErrors;
  }, [errors, customErrors]);

  // Sincroniza props -> form
  useEffect(() => {
    if (resolucion) {
      setData({
        id: resolucion.id,
        numero: resolucion.numero,
        fecha: resolucion.fecha,
        tipo: resolucion.tipo,
        link: resolucion.link,
        expediente_id: resolucion.expediente_id,
      });
    } else {
      reset();
    }
  }, [resolucion, reset, setData]);

  useEffect(() => {
    if (typeof expedienteId === "number") {
      setData("expediente_id", expedienteId);
    }
  }, [expedienteId, setData]);

  // Autogeneración reactiva del link
  useEffect(() => {
    if (!data.tipo || !data.fecha || !data.numero) return;
    const auto = getLinkFromData(data.tipo, data.fecha, data.numero);
    const isAuto = !data.link || data.link.startsWith("https://bo.unsa.edu.ar/");
    if (isAuto) setData("link", auto);
  }, [data.tipo, data.fecha, data.numero]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof ResolucionType, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Si hay onSubmit custom, lo usamos y salimos.
    if (onSubmit) {
      setCustomErrors({});
      onSubmit(data, {
        setProcessing: setCustomProcessing,
        setFieldErrors: setCustomErrors,
        reset,
      });
      return;
    }

    // === MODO DEFAULT: Inertia ===
    if (expedienteId) {
      const action = resolucion
        ? put(route('documentos.resoluciones.update', resolucion.id), {
            onError: () => {
              toast.error('Error al actualizar la resolución', {
                description: 'Revisá los campos del formulario.',
              });
            },
            onSuccess: () => {
              toast.success('Resolución actualizada');
              onSuccess?.();
            },
          })
        : post(route('documentos.expedientes.resoluciones.store'), {
            onError: () => {
              toast.error('Error al crear la resolución', {
                description: 'Revisá los campos del formulario.',
              });
            },
            onSuccess: () => {
              toast.success('Resolución creada');
              onSuccess?.();
            },
          });

      return action;
    } else {
      const action = resolucion
        ? put(route('documentos.resoluciones.update', resolucion.id), {
            onError: () => {
              toast.error('Error al actualizar la resolución', {
                description: 'Revisá los campos del formulario.',
              });
            },
            onSuccess: () => {
              toast.success('Resolución actualizada');
              onSuccess?.();
            },
          })
        : post(route('documentos.resoluciones.store'), {
            onError: () => {
              toast.error('Error al crear la resolución', {
                description: 'Revisá los campos del formulario.',
              });
            },
            onSuccess: () => {
              toast.success('Resolución creada');
              onSuccess?.();
            },
          });

      return action;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Número y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero" className="text-sm font-medium">Número *</Label>
          <Input
            id="numero"
            name="numero"
            placeholder="Número de resolución"
            value={data.numero}
            onChange={handleChange}
            className={fieldErrors.numero ? 'border-red-500' : ''}
          />
          {fieldErrors.numero && <p className="text-red-500 text-sm mt-1">{fieldErrors.numero}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha" className="text-sm font-medium">Fecha *</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={data.fecha}
            onChange={handleChange}
            className={fieldErrors.fecha ? 'border-red-500' : ''}
          />
          {fieldErrors.fecha && <p className="text-red-500 text-sm mt-1">{fieldErrors.fecha}</p>}
        </div>
      </div>

      {/* Segunda fila: Tipo y Expediente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo *</Label>
          <ComboBox
            options={resoluciones_tipos}
            value={data.tipo ?? ""}
            onChange={(val) => setData("tipo", val ?? "")}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {fieldErrors.tipo && <p className="text-red-500 text-sm mt-1">{fieldErrors.tipo}</p>}
        </div>

        <div className="space-y-2">
          {typeof expedienteId === "string" ? (
            <input type="hidden" name="expediente_id" value={expedienteId} />
          ) : (
            <>
              <Label className="text-sm font-medium">Expediente *</Label>
              <ComboBox
                options={expedientes.map(exp => ({ ...exp, value: String(exp.value) }))}
                value={data.expediente_id ? String(data.expediente_id) : ""}
                onChange={(val) => setData("expediente_id", val ? parseInt(val) : null)}
                placeholder="Seleccione un expediente"
                className="w-full"
              />
            </>
          )}
          {fieldErrors.expediente_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.expediente_id}</p>}
        </div>
      </div>

      {/* Tercera fila: Link (editable) */}
      <div className="space-y-2">
        <Label htmlFor="link" className="text-sm font-medium">Enlace (Link)</Label>
        <Input
          id="link"
          name="link"
          placeholder="https://bo.unsa.edu.ar/..."
          value={data.link ?? ""}
          onChange={handleChange}
          className={fieldErrors.link ? 'border-red-500' : ''}
        />
        {fieldErrors.link && <p className="text-red-500 text-sm mt-1">{fieldErrors.link}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Se genera automáticamente (según tipo, fecha y número). Podés editarlo si el documento tiene otra URL.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing || customProcessing}
        >
          {resolucion ? 'Actualizar Resolución' : 'Crear Resolución'}
        </Button>
      </div>
    </form>
  );
}
