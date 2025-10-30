import { useState } from "react";
import { MultiSelect, type Option } from "@/components/ui/multiselect";
import type { ConvenioFullType } from "@/schemas/convenio-schema";
import InstitucionForm from "@/components/forms/institution-form";
import DependenciaUnsaForm from "@/components/forms/dependency-form";
import PersonaRolForm from "@/components/forms/person-position-form";
import axios from "axios";
import { toast } from "sonner";
import { DropdownOption } from "@/types";

export function RelationsSection({
  data,
  institucionesProps,
  unidadesAcademicasProps,
  firmantesUnsaProps,
  onChange,
  instituciones_tipos,
  unidades_academicas_tipos,
  personas,
  roles,
}: {
  data: ConvenioFullType;
  institucionesProps: Option[];
  unidadesAcademicasProps: Option[];
  firmantesUnsaProps: Option[];
  onChange: (key: keyof ConvenioFullType, value: any) => void;
  instituciones_tipos: DropdownOption[];
  unidades_academicas_tipos: DropdownOption[];
  personas: DropdownOption[];
  roles: DropdownOption[];
}) {
  const [instituciones, setInstituciones] = useState<Option[]>(institucionesProps);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState<Option[]>(unidadesAcademicasProps);
  const [firmantesUnsa, setFirmantesUnsa] = useState<Option[]>(firmantesUnsaProps);

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <MultiSelect
        label="Instituciones"
        options={instituciones}
        selected={data.instituciones?.map((inst) => ({
          value: String(inst.id),
          label: inst.nombre,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("instituciones", selectedOptions.map(opt => ({ id: parseInt(opt.value), nombre: opt.label })))
        }
        withCreate
        createForm={({ onSuccess }) => (
          <InstitucionForm
            tipos={instituciones_tipos}
            isModal={true}
            onSuccess={(nuevo) => {
              const nuevaOption: Option = { value: String(nuevo.id), label: nuevo.nombre };
              onSuccess(nuevaOption);
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const nuevaOption = nuevo as Option;
          // Validar que label no sea undefined
          if (!nuevaOption.label) {
            console.error('Label undefined para nueva opción:', nuevaOption);
            return;
          }
          setInstituciones((prev: Option[]) => [...prev, nuevaOption]);
          onChange("instituciones", [...(data.instituciones || []), 
          { id: parseInt(nuevaOption.value), nombre: nuevaOption.label }]);
        }}
        placeholder="Buscar instituciones..."
        editRoute={route('entidades.instituciones.edit', ':id')}
      />

      <MultiSelect
        label="Unidades Académicas"
        options={unidadesAcademicas}
        selected={data.dependencias_unsa?.map((unidad) => ({
          value: String(unidad.id),
          label: unidad.nombre,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("dependencias_unsa", selectedOptions.map(opt => ({ id: parseInt(opt.value), nombre: opt.label })))
        }
        withCreate
        createForm={({ onSuccess }) => (
          <DependenciaUnsaForm
            tipos={unidades_academicas_tipos}
            isModal={true}
            onSuccess={(nuevo) => {
              const nuevaOption: Option = { value: String(nuevo.id), label: nuevo.nombre };
              onSuccess(nuevaOption);
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const nuevaOption = nuevo as Option;
          setUnidadesAcademicas((prev: Option[]) => [...prev, nuevaOption]);
          onChange("dependencias_unsa", [...(data.dependencias_unsa || []), 
          { id: parseInt(nuevaOption.value), nombre: nuevaOption.label }]);
        }}
        placeholder="Buscar unidades académicas..."
        editRoute={route('entidades.dependenciasUnsa.edit', ':id')}
      />

      <MultiSelect
        label="Firmantes por la UNSa"
        options={firmantesUnsa}
        selected={data.firmantes_unsa?.map((firmante) => ({
          value: String(firmante.id),
          label: firmante.persona.nombre,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("firmantes_unsa", selectedOptions.map(opt => ({ id: parseInt(opt.value), persona: { id: parseInt(opt.value), nombre: opt.label } })))
        }
        withCreate
        createForm={({ onSuccess }) => ( 
          
          <PersonaRolForm
            roles={roles}
            personas={personas}
            isModal={true}
            onSubmit={async (formData) => {
              try {
                const res = await axios.post(route("convenios.firmantesUnsa.store"), formData);
                toast.success("Firmante creado");
                const nuevaOption: Option = { value: String(res.data.data.id), label: res.data.data.persona.nombre + ' ' + res.data.data.persona.apellido + ' - ' + res.data.data.persona.dni || 'N/D' };
                onSuccess(nuevaOption);
              } catch (e) {
                toast.error("Error al crear firmante");
              }
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const nuevaOption = nuevo as Option;
          setFirmantesUnsa((prev: Option[]) => [...prev, nuevaOption]);
          onChange("firmantes_unsa", [...(data.firmantes_unsa || []), 
          { id: parseInt(nuevaOption.value), persona: { id: parseInt(nuevaOption.value), nombre: nuevaOption.label } }]);
        }}
        placeholder="Buscar firmantes..."
        editRoute={route('convenios.firmantesUnsa.edit', ':id')}
      />
    </div>
  );
}