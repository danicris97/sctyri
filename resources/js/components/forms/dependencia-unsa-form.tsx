import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { type DependenciaUnsaType } from '@/schemas/dependencia-unsa-schema';
import { LocationFields } from '@/components/ui/localizacion-field';
import type { LocationValue } from '@/components/ui/localizacion-field';
import type { LocationDataType } from '@/schemas/ubicacion-schemas';
import axios from 'axios';
import { DropdownOption } from '@/types';

type DependenciaUnsaFormData = DependenciaUnsaType & {
  pais_texto?: string | null;
  provincia_texto?: string | null;
  localidad_texto?: string | null;
  activo?: boolean;
};

type DependenciaUnsaFormProps = {
  dependenciaUnsa?: DependenciaUnsaType;
  dependencias_padre?: DropdownOption[];
  tipos: DropdownOption[];
  onSuccess?: (dependenciaUnsa: DependenciaUnsaType) => void;
  isModal?: boolean; // nuevo flag para detectar modo modal
  storeRouteName?: string;
  updateRouteName?: string;
};

export default function DependenciaUnsaForm({ 
  dependenciaUnsa,
  dependencias_padre = [],
  tipos = [], 
  onSuccess,
  isModal = false,
  storeRouteName = 'entidades.dependenciasUnsa.store',
  updateRouteName = 'entidades.dependenciasUnsa.update',
}: DependenciaUnsaFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<DependenciaUnsaFormData>({
    id: dependenciaUnsa?.id ?? 0,
    nombre: dependenciaUnsa?.nombre ?? '',
    abreviatura: dependenciaUnsa?.abreviatura ?? '',
    dependencia_padre_id: dependenciaUnsa?.dependencia_padre_id ?? null,
    tipo: dependenciaUnsa?.tipo ?? '',
    pais_id: dependenciaUnsa?.pais_id ?? null,
    provincia_id: dependenciaUnsa?.provincia_id ?? null,
    localidad_id: dependenciaUnsa?.localidad_id ?? null,
    domicilio: dependenciaUnsa?.domicilio ?? '',
    telefono: dependenciaUnsa?.telefono ?? '',
    email: dependenciaUnsa?.email ?? '',
    activo: dependenciaUnsa?.activo ?? true,
    pais_texto: null,
    provincia_texto: null,
    localidad_texto: null,
  });

  // Estado para manejar los valores de localización
  const [locationValue, setLocationValue] = useState<LocationValue>({
    pais: null,
    provincia: null,
    localidad: null,
  });

  const loadExistingLocation = async () => {
    if (!dependenciaUnsa) return;
  
    try {
      // Si tiene localidad_id, cargar la jerarquía completa
      if (dependenciaUnsa.localidad_id) {
        const response = await axios.get(route("localizaciones.get-localidad", { localidadId: dependenciaUnsa.localidad_id }));
        const jerarquia = response.data;
        
        setLocationValue({
          pais: jerarquia.pais || null,
          provincia: jerarquia.provincia || null,
          localidad: jerarquia.localidad || null,
        });
        return;
      }
      
      // Si solo tiene provincia_id
      if (dependenciaUnsa.provincia_id) {
        const response = await axios.get(route("localizaciones.get-provincia", { provinciaId: dependenciaUnsa.provincia_id }));
        const data = response.data;
        
        setLocationValue({
          pais: data.pais || null,
          provincia: data.provincia || null,
          localidad: null,
        });
        return;
      }
      
      // Si solo tiene pais_id
      if (dependenciaUnsa.pais_id) {
        const response = await axios.get(route("localizaciones.get-pais", { paisId: dependenciaUnsa.pais_id }));
        const data = response.data;
        
        setLocationValue({
          pais: data.pais || null,
          provincia: null,
          localidad: null,
        });
      }
    } catch (error) {
      console.error('Error loading existing location:', error);
      toast.error('Error al cargar la ubicación existente');
    }
  };

  useEffect(() => {
    if (dependenciaUnsa) {
      setData({
        id: dependenciaUnsa.id,
        nombre: dependenciaUnsa.nombre,
        abreviatura: dependenciaUnsa.abreviatura,
        dependencia_padre_id: dependenciaUnsa.dependencia_padre_id,
        tipo: dependenciaUnsa.tipo,
        pais_id: dependenciaUnsa.pais_id,
        provincia_id: dependenciaUnsa.provincia_id,
        localidad_id: dependenciaUnsa.localidad_id,
        domicilio: dependenciaUnsa.domicilio,
        telefono: dependenciaUnsa.telefono,
        email: dependenciaUnsa.email,
        activo: dependenciaUnsa.activo,
        pais_texto: null,
        provincia_texto: null,
        localidad_texto: null,
      });

      loadExistingLocation();
    } else {
      reset();
      setLocationValue({
        pais: null,
        provincia: null,
        localidad: null,
      });
    }
  }, [dependenciaUnsa, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof DependenciaUnsaFormData, value);
  };

  const handleLocationChange = (newLocationValue: LocationValue, extractedData: LocationDataType) => {
    setLocationValue(newLocationValue);
    
    // Actualizar todos los campos de ubicación en el formulario
    setData(prevData => ({
      ...prevData,
      pais_id: extractedData.pais_id,
      provincia_id: extractedData.provincia_id,
      localidad_id: extractedData.localidad_id,
      pais_texto: extractedData.pais_texto,
      provincia_texto: extractedData.provincia_texto,
      localidad_texto: extractedData.localidad_texto,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const submitData = { ...data };

    if (isModal) {
      try {
        await axios.post(route(storeRouteName), submitData)
          .then(res => {
            toast.success('Dependencia creada');
            onSuccess?.(res.data.data); 
          })
          .catch(() => {
            toast.error('Error al crear dependencia');
          });
        } catch {
          toast.error('Error al crear el dependencia', {
            description: 'Revisá los campos del formulario.',
          });
        }
      return;
    }

    if (dependenciaUnsa) {
      put(route(updateRouteName, dependenciaUnsa.id), {
        onError: () => {
          toast.error('Error al actualizar la Dependencia', {
            description: 'Revisá los campos del formulario.',
          });
        },
        onSuccess: () => {
          toast.success('Dependencia actualizada');
          onSuccess?.(submitData);
        },
      });
    } else {
      post(route(storeRouteName), {
        onError: () => {
          toast.error('Error al crear la Dependencia', {
            description: 'Revisá los campos del formulario.',
          });
        },
        onSuccess: () => {
          toast.success('Dependencia creada');
          onSuccess?.(submitData as DependenciaUnsaType);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Nombre y Abreviatura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Nombre *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Nombre completo de la dependencia"
            value={data.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nombre}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="abreviatura" className="text-sm font-medium">
            Abreviatura
          </Label>
          <Input
            id="abreviatura"
            name="abreviatura"
            placeholder="Ejemplo: SCTRI"
            value={data.abreviatura ?? ''}
            onChange={handleChange}
            className={errors.abreviatura ? 'border-red-500' : ''}
          />
          {errors.abreviatura && (
            <p className="text-red-500 text-sm mt-1">
              {errors.abreviatura}
            </p>
          )}
        </div>
      </div>

      {/* Segunda fila: Tipo y Localidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tipo *
          </Label>
          <ComboBox
            options={tipos}
            value={data.tipo ?? ''}
            onChange={(val) => setData('tipo', val)}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipo}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Dependencia Padre
          </Label>
          <ComboBox
            options={dependencias_padre}
            value={data.dependencia_padre_id?.toString() ?? null}
            onChange={(val) => setData('dependencia_padre_id', val ? Number(val) : null)}
            placeholder="Seleccione la dependencia a la que pertenece"
            className="w-full"
          />
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipo}
            </p>
          )}
        </div>
      </div>

      {/* Tercera fila: Localización */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Localización
          </Label>
          <LocationFields
            value={locationValue}
            onChange={handleLocationChange}
            errors={errors}
          />
        </div>

      {/* Tercera fila: Domicilio */}
      <div className="space-y-2">
        <Label htmlFor="domicilio" className="text-sm font-medium">
          Domicilio
        </Label>
        <Input
          id="domicilio"
          name="domicilio"
          placeholder="Dirección completa"
          value={data.domicilio ?? ''}
          onChange={handleChange}
          className={errors.domicilio ? 'border-red-500' : ''}
        />
        {errors.domicilio && (
          <p className="text-red-500 text-sm mt-1">
            {errors.domicilio}
          </p>
        )}
      </div>

      {/* Cuarta fila: Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium">
            Teléfono
          </Label>
          <Input
            id="telefono"
            name="telefono"
            placeholder="Número de teléfono"
            value={data.telefono ?? ''}
            onChange={handleChange}
            className={errors.telefono ? 'border-red-500' : ''}
          />
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">
              {errors.telefono}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={data.email ?? ''}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Quinta fila: Estado */}
      <div className="flex items-center space-x-2 pt-2">
        <Label htmlFor="activo" className="text-sm font-medium">
          ¿Esta activo?
        </Label>
        <Checkbox
          id="activo"
          checked={data.activo}
          onCheckedChange={(checked) => setData('activo', !!checked)}
        />
        {errors.activo && (
          <p className="text-red-500 text-sm ml-2">
            {errors.activo}
          </p>
        )}
      </div>

      {/* Botón de submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing}
        >
          {dependenciaUnsa ? 'Actualizar Dependencia UNSa' : 'Crear Dependencia UNSa'}
        </Button>
      </div>
    </form>
  );
}
