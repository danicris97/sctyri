import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ComboBox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { GenericDialog } from "@/components/ui/generic-dialog";

import DependenciaUnsaForm from "@/components/forms/dependencia-unsa-form";
import InstitucionForm from "@/components/forms/institucion-form";
import PersonaRolForm from "@/components/forms/persona-rol-form";

import type { ExpedienteType } from "@/schemas/expediente-schema";
import type { DropdownOption } from "@/types";

type ExpedienteSectionProps = {
  /** Datos del expediente desde el form padre */
  data: ExpedienteType;
  /** Callback para actualizar campos en el form padre */
  onChange: (key: keyof ExpedienteType, value: any) => void;
  /** Errores de validación (opcional) */
  errors?: Partial<Record<keyof ExpedienteType, string>>;

  /** Opciones para los selects */
  expedientes: DropdownOption[];
  tipos: DropdownOption[];
  tipos_dependencias?: DropdownOption[];
  dependencias: DropdownOption[];
  tipos_instituciones?: DropdownOption[];
  instituciones: DropdownOption[];
  personas: DropdownOption[];
  roles?: DropdownOption[];
  persona_roles?: DropdownOption[];
};

const mergeDropdownOptions = (current: DropdownOption[], incoming: DropdownOption[] = []) => {
  const incomingMap = new Map(incoming.map((o) => [o.value, o]));
  const preserved = current.filter((o) => !incomingMap.has(o.value));
  return [...preserved, ...incoming];
};

const dropdownOptionsEqual = (a: DropdownOption[], b: DropdownOption[]) =>
  a.length === b.length && a.every((o, i) => o.value === b[i]?.value && o.label === b[i]?.label);

const normalizeDropdownOption = (option: DropdownOption | Record<string, any>): DropdownOption => {
  if (!option) {
    return { value: '', label: '' };
  }

  const candidate = option as Record<string, any>;
  const rawValue =
    candidate.value ??
    candidate.id ??
    candidate.key ??
    candidate.persona_id ??
    candidate.personaId ??
    candidate.codigo ??
    null;

  const normalizedValue = rawValue !== null && rawValue !== undefined ? String(rawValue) : '';

  let rawLabel = candidate.label ?? candidate.nombre ?? candidate.text ?? candidate.descripcion ?? candidate.title ?? '';

  if (!rawLabel && (candidate.dni || candidate.apellido || candidate.nombre)) {
    const pieces = [candidate.dni, candidate.apellido, candidate.nombre]
      .map((piece) => (typeof piece === 'string' ? piece.trim() : ''))
      .filter((piece) => piece.length > 0);
    rawLabel = pieces.join(' - ');
  }

  const normalizedLabel = rawLabel && typeof rawLabel === 'string' && rawLabel.trim().length > 0
    ? rawLabel.trim()
    : normalizedValue;

  return {
    value: normalizedValue,
    label: normalizedLabel,
  };
};

const ensureDropdownOptions = (options: Array<DropdownOption | Record<string, any>> = []) =>
  options
    .map((option) => normalizeDropdownOption(option))
    .filter((option) => option.value !== '');


export default function ExpedienteSection({
  data,
  onChange,
  errors = {},
  expedientes = [],
  tipos = [],
  tipos_dependencias = [],
  dependencias = [],
  tipos_instituciones = [],
  instituciones = [],
  personas = [],
  roles = [],
  persona_roles = [],
}: ExpedienteSectionProps) {
  // Opciones locales (para inyectar recién creados)
  const normalizedExpedientes = useMemo(() => ensureDropdownOptions(expedientes), [expedientes]);
  const [expOptions, setExpOptions] = useState<DropdownOption[]>(normalizedExpedientes);
  const normalizedDependencias = useMemo(() => ensureDropdownOptions(dependencias), [dependencias]);
  const [depOptions, setDepOptions] = useState<DropdownOption[]>(normalizedDependencias);
  const normalizedInstituciones = useMemo(() => ensureDropdownOptions(instituciones), [instituciones]);
  const [instOptions, setInstOptions] = useState<DropdownOption[]>(normalizedInstituciones);
  const normalizedPersonas = useMemo(() => ensureDropdownOptions(personas), [personas]);
  const [perOptions, setPerOptions] = useState<DropdownOption[]>(normalizedPersonas);

  const isExpedientePristine = (exp: ExpedienteType) =>
    (exp.numero ?? "") === "" &&
    (exp.tipo ?? "") === "" &&
    (exp.extracto ?? "") === "" &&
    exp.dependencia_id == null &&
    (exp.fecha_inicio ?? "") === "" &&
    (exp.fecha_cierre ?? "") === "" &&
    !exp.internacional &&
    (exp.observaciones ?? "") === "" &&
    exp.causante_dependencia_id == null &&
    exp.causante_persona_id == null &&
    exp.causante_institucion_id == null;

  const [selectedExpedienteId, setSelectedExpedienteId] = useState<number | null>(() => {
    if (data.id && data.id > 0 && isExpedientePristine(data)) {
      return data.id;
    }
    return null;
  });

  useEffect(() => {
    if (data.id && data.id > 0 && isExpedientePristine(data)) {
      setSelectedExpedienteId((prev) => (prev === data.id ? prev : data.id));
    } else if ((!data.id || data.id === 0) && selectedExpedienteId !== null && !isExpedientePristine(data)) {
      setSelectedExpedienteId(null);
    }
  }, [
    data.id,
    data.numero,
    data.tipo,
    data.extracto,
    data.dependencia_id,
    data.fecha_inicio,
    data.fecha_cierre,
    data.internacional,
    data.observaciones,
    data.causante_dependencia_id,
    data.causante_persona_id,
    data.causante_institucion_id,
    selectedExpedienteId,
  ]);

  const isExistingSelected = selectedExpedienteId !== null;

  const resetExpedienteFields = () => {
    onChange("numero", "");
    onChange("anio", new Date().getFullYear());
    onChange("tipo", "");
    onChange("extracto", "");
    onChange("dependencia_id", null);
    onChange("fecha_inicio", "");
    onChange("fecha_cierre", "");
    onChange("internacional", false);
    onChange("observaciones", "");
    onChange("causante_dependencia_id", null);
    onChange("causante_persona_id", null);
    onChange("causante_institucion_id", null);
  };

  useEffect(() => {
    setExpOptions((prev) => {
      const merged = mergeDropdownOptions(prev, normalizedExpedientes);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [normalizedExpedientes]);

  useEffect(() => {
    setDepOptions((prev) => {
      const merged = mergeDropdownOptions(prev, normalizedDependencias);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [normalizedDependencias]);

  useEffect(() => {
    setInstOptions((prev) => {
      const merged = mergeDropdownOptions(prev, normalizedInstituciones);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [normalizedInstituciones]);

  useEffect(() => {
    setPerOptions((prev) => {
      const merged = mergeDropdownOptions(prev, normalizedPersonas);
      return dropdownOptionsEqual(prev, merged) ? prev : merged;
    });
  }, [normalizedPersonas]);

  // Diálogos de creación
  const [openDepCreate, setOpenDepCreate] = useState(false);
  const [openInstCreate, setOpenInstCreate] = useState(false);
  const [openPerCreate, setOpenPerCreate] = useState(false);

  // Bloqueos causantes (solo uno puede estar seleccionado)
  const disableDep = !!data.causante_persona_id || !!data.causante_institucion_id;
  const disablePer = !!data.causante_dependencia_id || !!data.causante_institucion_id;
  const disableInst = !!data.causante_dependencia_id || !!data.causante_persona_id;

  const clearOthers = (picked: "dep" | "per" | "inst") => {
    if (picked === "dep") {
      onChange("causante_persona_id", null);
      onChange("causante_institucion_id", null);
    } else if (picked === "per") {
      onChange("causante_dependencia_id", null);
      onChange("causante_institucion_id", null);
    } else {
      onChange("causante_dependencia_id", null);
      onChange("causante_persona_id", null);
    }
  };

  const handleSelectDep = (val: string | null) => {
    onChange("causante_dependencia_id", val ? Number(val) : null);
    if (val) clearOthers("dep");
  };

  const handleSelectPer = (val: string | null) => {
    onChange("causante_persona_id", val ? Number(val) : null);
    if (val) clearOthers("per");
  };

  const handleSelectInst = (val: string | null) => {
    onChange("causante_institucion_id", val ? Number(val) : null);
    if (val) clearOthers("inst");
  };

  // Handlers de creación
  const onDepCreated = (dep: any) => {
    const opt: DropdownOption = { 
      value: String(dep.id), 
      label: dep.nombre || dep.abreviatura || `ID ${dep.id}` 
    };
    setDepOptions((prev) =>
      prev.find((o) => o.value === opt.value) 
        ? prev.map((o) => (o.value === opt.value ? opt : o)) 
        : [opt, ...prev]
    );
    onChange("causante_dependencia_id", dep.id);
    clearOthers("dep");
    setOpenDepCreate(false);
  };

  const onInstCreated = (inst: any) => {
    const opt: DropdownOption = { value: String(inst.id), label: inst.nombre || `ID ${inst.id}` };
    setInstOptions((prev) =>
      prev.find((o) => o.value === opt.value) 
        ? prev.map((o) => (o.value === opt.value ? opt : o)) 
        : [opt, ...prev]
    );
    onChange("causante_institucion_id", inst.id);
    clearOthers("inst");
    setOpenInstCreate(false);
  };

  const onPerCreated = (pr: any) => {
    const label = pr?.persona?.dni
      ? `${pr.persona.apellido}, ${pr.persona.nombre} (${pr.persona.dni})`
      : `${pr?.persona?.apellido ?? ""}, ${pr?.persona?.nombre ?? ""}`.trim();
    const opt: DropdownOption = { value: String(pr.id), label: label || `ID ${pr.id}` };
    setPerOptions((prev) =>
      prev.find((o) => o.value === opt.value) 
        ? prev.map((o) => (o.value === opt.value ? opt : o)) 
        : [opt, ...prev]
    );
    onChange("causante_persona_id", pr.id);
    clearOthers("per");
    setOpenPerCreate(false);
  };

  // Cuando se selecciona un expediente existente, solo guarda el ID y bloquea los campos
  const handleSelectExpediente = (val: string | null) => {
    const id = val && val !== "" ? Number(val) : null;

    if (!id) {
      setSelectedExpedienteId(null);
      onChange("id", 0);
      resetExpedienteFields();
      return;
    }

    setSelectedExpedienteId(id);
    onChange("id", id);
    resetExpedienteFields();
  };

  // Cuando el usuario edita manualmente, limpiamos el id (indica que es nuevo)
  const ensureNoSelectedWhenEditing = () => {
    if (isExistingSelected) {
      setSelectedExpedienteId(null);
      onChange("id", 0);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    ensureNoSelectedWhenEditing();
    onChange(name as keyof ExpedienteType, type === "checkbox" ? checked : value);
  };

  const depValue = data.causante_dependencia_id ? String(data.causante_dependencia_id) : null;
  const instValue = data.causante_institucion_id ? String(data.causante_institucion_id) : null;
  const perValue = data.causante_persona_id ? String(data.causante_persona_id) : null;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border">
      {/* Selector de Expediente existente */}
      <div className="space-y-2">
        <Label>Expediente asociado</Label>
        <ComboBox
          options={expOptions}
          value={selectedExpedienteId ? String(selectedExpedienteId) : ""}
          onChange={handleSelectExpediente}
          placeholder="Seleccione un expediente existente"
          className="w-full"
        />
        {isExistingSelected && (
          <p className="text-xs text-muted-foreground">
            Expediente seleccionado (solo lectura). Limpia el selector para crear uno nuevo.
          </p>
        )}
      </div>

      {/* Formulario de Expediente */}
      <div className="space-y-6">
        {/* Primera fila: Número y Año */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="numero">Número de Expediente *</Label>
            <Input
              id="numero"
              name="numero"
              placeholder="Ejemplo: 22520"
              value={data.numero || ""}
              onChange={handleChangeInput}
              className={errors.numero ? "border-red-500" : ""}
              disabled={isExistingSelected}
            />
            {errors.numero && <p className="mt-1 text-sm text-red-500">{errors.numero}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="anio">Año *</Label>
            <Input
              id="anio"
              name="anio"
              type="number"
              placeholder="2024"
              value={data.anio || new Date().getFullYear()}
              onChange={handleChangeInput}
              min="1900"
              max="2099"
              className={errors.anio ? "border-red-500" : ""}
              disabled={isExistingSelected}
            />
            {errors.anio && <p className="mt-1 text-sm text-red-500">{errors.anio}</p>}
          </div>
        </div>

        {/* Segunda fila: Tipo y Dependencia */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo de Expediente</Label>
            <ComboBox
              options={tipos}
              value={data.tipo ? String(data.tipo) : ""}
              onChange={(val) => {
                ensureNoSelectedWhenEditing();
                onChange("tipo", val ? String(val) : null);
              }}
              placeholder="Seleccione un tipo"
              className="w-full"
              disabled={isExistingSelected}
            />
            {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
          </div>
          <div className="space-y-2">
            <Label>Dependencia</Label>
            <ComboBox
              options={depOptions}
              value={data.dependencia_id ? String(data.dependencia_id) : ""}
              onChange={(val) => {
                ensureNoSelectedWhenEditing();
                onChange("dependencia_id", val ? parseInt(val) : null);
              }}
              placeholder="Seleccione una dependencia"
              className="w-full"
              disabled={isExistingSelected}
            />
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
                disabled={isExistingSelected || disableDep}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDepCreate(true)}
                disabled={isExistingSelected || disableDep}
                title="Nueva dependencia"
              >
                +
              </Button>
            </div>
            {errors.causante_dependencia_id && (
              <p className="mt-1 text-xs text-red-500">{errors.causante_dependencia_id}</p>
            )}
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
                disabled={isExistingSelected || disablePer}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenPerCreate(true)}
                disabled={isExistingSelected || disablePer}
                title="Nueva persona"
              >
                +
              </Button>
            </div>
            {errors.causante_persona_id && (
              <p className="mt-1 text-xs text-red-500">{errors.causante_persona_id}</p>
            )}
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
                disabled={isExistingSelected || disableInst}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenInstCreate(true)}
                disabled={isExistingSelected || disableInst}
                title="Nueva institución"
              >
                +
              </Button>
            </div>
            {errors.causante_institucion_id && (
              <p className="mt-1 text-xs text-red-500">{errors.causante_institucion_id}</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Al seleccionar o crear uno, los otros dos quedan bloqueados automáticamente.
          </p>
        </div>
        
        {/* Internacional */}
        <div className="flex items-center gap-2">
          <input
            id="internacional"
            name="internacional"
            type="checkbox"
            checked={!!data.internacional}
            onChange={handleChangeInput}
            className="rounded"
            disabled={isExistingSelected}
          />
          <Label htmlFor="internacional">Internacional</Label>
        </div>
      </div>

      {/* Diálogos de CREACIÓN */}
      <GenericDialog
        open={openDepCreate}
        onClose={() => setOpenDepCreate(false)}
        title="Nueva Dependencia UNSa"
        size="xxl"
      >
        <DependenciaUnsaForm
          isModal
          tipos={tipos_dependencias}
          dependencias_padre={depOptions}
          onSuccess={onDepCreated}
          storeRouteName="entidades.dependenciasUnsa.store"
          updateRouteName="entidades.dependenciasUnsa.update"
        />
      </GenericDialog>

      <GenericDialog
        open={openInstCreate}
        onClose={() => setOpenInstCreate(false)}
        title="Nueva Institución"
        size="xxl"
      >
        <InstitucionForm
          isModal
          tipos={tipos_instituciones}
          onSuccess={onInstCreated}
          storeRouteName="entidades.instituciones.store"
          updateRouteName="entidades.instituciones.update"
        />
      </GenericDialog>

      <GenericDialog
        open={openPerCreate}
        onClose={() => setOpenPerCreate(false)}
        title="Nueva Persona"
        size="xxl"
      >
        <PersonaRolForm
          isModal
          personas={perOptions}
          roles={roles?.length ? roles : (persona_roles ?? [])}
          onSubmit={async (payload) => {
            try {
              const res = await axios.post(route("entidades.personas.store"), payload);
              toast.success("Persona creada");
              onPerCreated(res.data.data ?? res.data);
            } catch {
              toast.error("Error al crear Persona");
            }
          }}
        />
      </GenericDialog>
    </div>
  );
}