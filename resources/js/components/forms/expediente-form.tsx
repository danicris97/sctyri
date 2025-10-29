import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { GenericDialog } from '@/components/ui/generic-dialog';
import DependenciaUnsaForm from '@/components/forms/dependencia-unsa-form';
import InstitucionForm from '@/components/forms/institucion-form';
import PersonaRolForm from '@/components/forms/person-position-form';
import type { ExpedienteType } from '@/schemas/expediente-schema';
import type { DropdownOption } from '@/types';

type ExpedienteFormProps = {
  expediente?: ExpedienteType;
  tipos: DropdownOption[];
  tipos_dependencias?: DropdownOption[];
  dependencias: DropdownOption[];
  tipos_instituciones?: DropdownOption[];
  instituciones: DropdownOption[];
  personas: DropdownOption[];
  roles?: DropdownOption[];
  persona_roles?: DropdownOption[];
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
  tipos_dependencias = [],
  dependencias = [],
  tipos_instituciones = [],
  instituciones = [],
  personas = [],
  roles = [],
  persona_roles = [],
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
  const [instOptions, setInstOptions] = useState<DropdownOption[]>(instituciones ?? []);
  const [perOptions, setPerOptions] = useState<DropdownOption[]>(personas ?? []);

  useEffect(() => {
    const incoming = dependencias ?? [];
    setDepOptions(prev => {
      const merged = mergeDropdownOptions(prev, incoming);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [dependencias]);

  useEffect(() => {
    const incoming = instituciones ?? [];
    setInstOptions(prev => {
      const merged = mergeDropdownOptions(prev, incoming);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [instituciones]);

  useEffect(() => {
    const incoming = personas ?? [];
    setPerOptions(prev => {
      const merged = mergeDropdownOptions(prev, incoming);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [personas]);

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

  // Reglas de bloqueo (solo uno de los 3 causantes)
  const disableDep = !!data.causante_persona_id || !!data.causante_institucion_id;
  const disablePer = !!data.causante_dependencia_id || !!data.causante_institucion_id;
  const disableInst = !!data.causante_dependencia_id || !!data.causante_persona_id;

  const clearOthers = (picked: 'dep' | 'per' | 'inst') => {
    if (picked === 'dep') {
      setData('causante_persona_id', null);
      setData('causante_institucion_id', null);
    } else if (picked === 'per') {
      setData('causante_dependencia_id', null);
      setData('causante_institucion_id', null);
    } else {
      setData('causante_dependencia_id', null);
      setData('causante_persona_id', null);
    }
  };

  const handleSelectDep = (val: string | null) => {
    setData('causante_dependencia_id', val ? Number(val) : null);
    if (val) clearOthers('dep');
  };

  const handleSelectPer = (val: string | null) => {
    setData('causante_persona_id', val ? Number(val) : null);
    if (val) clearOthers('per');
  };

  const handleSelectInst = (val: string | null) => {
    setData('causante_institucion_id', val ? Number(val) : null);
    if (val) clearOthers('inst');
  };

  // Diálogos para CREAR (ya no hay edición)
  const [openDepCreate, setOpenDepCreate] = useState(false);
  const [openInstCreate, setOpenInstCreate] = useState(false);
  const [openPerCreate, setOpenPerCreate] = useState(false);

  // Callbacks de creación (inyectan option y seleccionan)
  const onDepCreated = (dep: any) => {
    const opt: DropdownOption = { value: String(dep.id), label: dep.nombre || dep.abreviatura || `ID ${dep.id}` };
    setDepOptions(prev => (prev.find(o => o.value === opt.value) ? prev.map(o => (o.value === opt.value ? opt : o)) : [opt, ...prev]));
    setData('causante_dependencia_id', dep.id);
    clearOthers('dep');
    setOpenDepCreate(false);
  };

  const onInstCreated = (inst: any) => {
    const opt: DropdownOption = { value: String(inst.id), label: inst.nombre || `ID ${inst.id}` };
    setInstOptions(prev => (prev.find(o => o.value === opt.value) ? prev.map(o => (o.value === opt.value ? opt : o)) : [opt, ...prev]));
    setData('causante_institucion_id', inst.id);
    clearOthers('inst');
    setOpenInstCreate(false);
  };

  const onPerCreated = (pr: any) => {
    const label =
      pr?.persona?.dni
        ? `${pr.persona.apellido}, ${pr.persona.nombre} (${pr.persona.dni})`
        : `${pr?.persona?.apellido ?? ''}, ${pr?.persona?.nombre ?? ''}`.trim();
    const opt: DropdownOption = { value: String(pr.id), label: label || `ID ${pr.id}` };
    setPerOptions(prev => (prev.find(o => o.value === opt.value) ? prev.map(o => (o.value === opt.value ? opt : o)) : [opt, ...prev]));
    setData('causante_persona_id', pr.id);
    clearOthers('per');
    setOpenPerCreate(false);
  };

  const depValue = data.causante_dependencia_id ? String(data.causante_dependencia_id) : null;
  const instValue = data.causante_institucion_id ? String(data.causante_institucion_id) : null;
  const perValue = data.causante_persona_id ? String(data.causante_persona_id) : null;

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

      {/* Causante (solo uno) */}
      <div className="space-y-2">
        <Label>Causante (seleccioná solo uno)</Label>

        {/* Dependencia causante */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Dependencia causante</Label>
          <div className="flex gap-2">
            <ComboBox 
              options={depOptions} 
              value={depValue} 
              onChange={handleSelectDep} 
              placeholder="Buscar dependencia..." 
              className="w-full" 
              disabled={disableDep} />
            <Button type="button" variant="outline" onClick={() => setOpenDepCreate(true)} disabled={disableDep} title="Nueva dependencia">+</Button>
          </div>
          {errors.causante_dependencia_id && <p className="mt-1 text-xs text-red-500">{errors.causante_dependencia_id}</p>}
        </div>

        {/* Persona-Rol causante */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Persona causante</Label>
          <div className="flex gap-2">
            <ComboBox 
              options={perOptions} 
              value={perValue} 
              onChange={handleSelectPer} 
              placeholder="Buscar persona..." 
              className="w-full" 
              disabled={disablePer} />
            <Button type="button" variant="outline" onClick={() => setOpenPerCreate(true)} disabled={disablePer} title="Nueva persona">+</Button>
          </div>
          {errors.causante_persona_id && <p className="mt-1 text-xs text-red-500">{errors.causante_persona_id}</p>}
        </div>

        {/* Institución causante */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Institución causante</Label>
          <div className="flex gap-2">
            <ComboBox 
              options={instOptions} 
              value={instValue} 
              onChange={handleSelectInst} 
              placeholder="Buscar institución..." 
              className="w-full" 
              disabled={disableInst} />
            <Button type="button" variant="outline" onClick={() => setOpenInstCreate(true)} disabled={disableInst} title="Nueva institución">+</Button>
          </div>
          {errors.causante_institucion_id && <p className="mt-1 text-xs text-red-500">{errors.causante_institucion_id}</p>}
        </div>

        <p className="text-xs text-muted-foreground">Al seleccionar o crear uno, los otros dos quedan bloqueados automáticamente.</p>
      </div>

      {/* Extracto */}
      <div className="space-y-2">
        <Label htmlFor="extracto">Extracto del Expediente</Label>
        <Textarea 
          id="extracto" 
          name="extracto" 
          placeholder="Descripción breve..." 
          value={data.extracto || ''} onChange={e => setData('extracto', e.target.value)} 
          rows={4} 
          maxLength={255} 
          className={errors.extracto ? 'border-red-500' : ''} />
        <div className="mt-1 flex items-center justify-between">
          {errors.extracto && <p className="text-sm text-red-500">{errors.extracto}</p>}
          <span className="text-xs text-muted-foreground">{data.extracto?.length || 0}/255 caracteres</span>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
          <Input 
            id="fecha_inicio" 
            name="fecha_inicio" 
            type="date" 
            value={data.fecha_inicio || ''} 
            onChange={handleChange} 
            className={errors.fecha_inicio ? 'border-red-500' : ''} />
          {errors.fecha_inicio && <p className="mt-1 text-sm text-red-500">{errors.fecha_inicio}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_cierre">Fecha de Cierre</Label>
          <Input 
            id="fecha_cierre" 
            name="fecha_cierre" 
            type="date" 
            value={data.fecha_cierre || ''} 
            onChange={handleChange} 
            min={data.fecha_inicio || undefined} 
            className={errors.fecha_cierre ? 'border-red-500' : ''} />
          {errors.fecha_cierre && <p className="mt-1 text-sm text-red-500">{errors.fecha_cierre}</p>}
        </div>
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea 
          id="observaciones" 
          name="observaciones" 
          placeholder="Observaciones del expediente..." 
          value={data.observaciones || ''} 
          onChange={e => setData('observaciones', e.target.value)} 
          rows={4} 
          maxLength={255} 
          className={errors.observaciones ? 'border-red-500' : ''} />
        <div className="mt-1 flex items-center justify-between">
          {errors.observaciones && <p className="text-sm text-red-500">{errors.observaciones}</p>}
          <span className="text-xs text-muted-foreground">{data.observaciones?.length || 0}/255 caracteres</span>
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

      {/* Diálogos de CREACIÓN */}
      <GenericDialog open={openDepCreate} onClose={() => setOpenDepCreate(false)} title="Nueva Dependencia UNSa" size="xxl">
        <DependenciaUnsaForm
          isModal
          tipos={tipos_dependencias}
          dependencias_padre={depOptions}
          onSuccess={onDepCreated}
          storeRouteName="entidades.dependenciasUnsa.store"
          updateRouteName="entidades.dependenciasUnsa.update"
        />
      </GenericDialog>

      <GenericDialog open={openInstCreate} onClose={() => setOpenInstCreate(false)} title="Nueva Institución" size="xxl">
        <InstitucionForm
          isModal
          tipos={tipos_instituciones}
          onSuccess={onInstCreated}
          storeRouteName="entidades.instituciones.store"
          updateRouteName="entidades.instituciones.update"
        />
      </GenericDialog>

      <GenericDialog open={openPerCreate} onClose={() => setOpenPerCreate(false)} title="Nueva Persona/Rol" size="xxl">
        <PersonaRolForm
          isModal
          personas={perOptions}
          roles={roles}
          onSubmit={async payload => {
            try {
              const res = await axios.post(route('entidades.personas.store'), payload);
              toast.success('Persona creada');
              onPerCreated(res.data.data ?? res.data);
            } catch {
              toast.error('Error al crear Persona');
            }
          }}
        />
      </GenericDialog>
    </form>
  );
}
