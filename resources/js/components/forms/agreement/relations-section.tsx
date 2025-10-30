import { useState } from "react";
import { MultiSelect } from "@/components/ui/multiselect";
import InstitutionForm from "@/components/forms/institution-form";
import DependencyForm from "@/components/forms/dependency-form";
import PersonPositionsForm from "@/components/forms/person-position-form";
import axios from "axios";
import { toast } from "sonner";
import { Option } from "@/types";
import { AgreementFormData } from "@/types/agreement"

export function RelationsSection({
  data,
  institutionsProps,
  dependenciesProps,
  personPositionsProps,
  onChange,
  institutions_types,
  dependencies_types,
  persons,
  positions,
}: {
  data: AgreementFormData;
  institutionsProps: Option[];
  dependenciesProps: Option[];
  personPositionsProps: Option[];
  onChange: (key: keyof AgreementFormData, value: any) => void;
  institutions_types: Option[];
  dependencies_types: Option[];
  persons: Option[];
  positions: Option[];
}) {
  const [institutions, setInstitutions] = useState<Option[]>(institutionsProps);
  const [dependencies, setDependencies] = useState<Option[]>(dependenciesProps);
  const [personPositions, setPersonPositions] = useState<Option[]>(personPositionsProps);

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <MultiSelect
        label="Instituciones"
        options={institutions}
        selected={data.institutions?.map((inst) => ({
          value: String(inst.id),
          label: inst.name,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("institutions", selectedOptions.map(opt => ({ id: parseInt(opt.value), name: opt.label })))
        }
        withCreate
        createForm={({ onSuccess }) => (
          <InstitutionForm
            types={institutions_types}
            onSuccess={(nuevo) => {
              const newOption: Option = { value: String(nuevo.id), label: nuevo.name };
              onSuccess(newOption);
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const newOption = nuevo as Option;
          // Validar que label no sea undefined
          if (!newOption.label) {
            console.error('Label undefined para nueva opción:', newOption);
            return;
          }
          setInstitutions((prev: Option[]) => [...prev, newOption]); 
          onChange("institutions", [...(data.institutions || []), 
          { id: parseInt(newOption.value), name: newOption.label }]);
        }}
        placeholder="Buscar instituciones..."
        editRoute={route('entidades.instituciones.edit', ':id')}
      />

      <MultiSelect
        label="Unidades Académicas"
        options={dependencies}
        selected={data.dependencies?.map((unidad) => ({
          value: String(unidad.id),
          label: unidad.name,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("dependencies", selectedOptions.map(opt => ({ id: parseInt(opt.value), name: opt.label })))
        }
        withCreate
        createForm={({ onSuccess }) => (
          <DependencyForm
            types={dependencies_types}
            onSuccess={(nuevo) => {
              const newOption: Option = { value: String(nuevo.id), label: nuevo.name };
              onSuccess(newOption);
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const newOption = nuevo as Option;
          setDependencies((prev: Option[]) => [...prev, newOption]);
          onChange("dependencies", [...(data.dependencies || []), 
          { id: parseInt(newOption.value), name: newOption.label }]);
        }}
        placeholder="Buscar unidades académicas..."
        editRoute={route('entidades.dependenciasUnsa.edit', ':id')}
      />

      <MultiSelect
        label="Firmantes por la UNSa"
        options={personPositions}
        selected={data.person_positions?.map((firmante) => ({
          value: String(firmante.id),
          label: firmante.person.name,
        })) || []}
        onSelectedChange={(selectedOptions) =>
          onChange("person_positions", selectedOptions.map(opt => ({ id: parseInt(opt.value), person: { id: parseInt(opt.value), name: opt.label } })))
        }
        withCreate
        createForm={({ onSuccess }) => ( 
          
          <PersonPositionsForm
            positions={positions}
            persons={persons}
            isModal={true}
            onSubmit={async (formData) => {
              try {
                const res = await axios.post(route("convenios.firmantesUnsa.store"), formData);
                toast.success("Firmante creado");
                const newOption: Option = { value: String(res.data.data.id), label: res.data.data.person.nombre + ' ' + res.data.data.person.apellido + ' - ' + res.data.data.person.dni || 'N/D' };
                onSuccess(newOption);
              } catch (e) {
                toast.error("Error al crear firmante");
              }
            }}
          />
        )}
        onCreated={(nuevo: unknown) => {
          const newOption = nuevo as Option;
          setPersonPositions((prev: Option[]) => [...prev, newOption]);
          onChange("person_positions", [...(data.person_positions || []), 
          { id: parseInt(newOption.value), person: { id: parseInt(newOption.value), name: newOption.label } }]);
        }}
        placeholder="Buscar firmantes..."
        editRoute={route('convenios.firmantesUnsa.edit', ':id')}
      />
    </div>
  );
}