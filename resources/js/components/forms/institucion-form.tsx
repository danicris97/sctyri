import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { type InstitucionType } from '@/schemas/institucion-schema';
import { toast } from 'sonner';
import { ComboBox } from "@/components/ui/combobox";
import { LocationFields } from '@/components/ui/localizacion-field';
import type { LocationValue } from '@/components/ui/localizacion-field';
import type { LocationDataType } from '@/schemas/ubicacion-schemas';
import axios from 'axios';
import { DropdownOption } from '@/types';

// Extender el tipo InstitucionType para incluir los campos de texto
type InstitucionFormData = InstitucionType & {
  pais_texto?: string | null;
  provincia_texto?: string | null;
  localidad_texto?: string | null;
  activo?: boolean;
};

type InstitucionFormProps = {
  institucion?: InstitucionType;
  tipos: DropdownOption[];
  onSuccess?: (institucion: InstitucionType) => void;
  isModal?: boolean;
  storeRouteName?: string;
  updateRouteName?: string;
};

export default function InstitucionForm({ 
  institucion, 
  tipos = [], 
  onSuccess,
  isModal = false,
  storeRouteName = 'entidades.instituciones.store',
  updateRouteName = 'entidades.instituciones.update',
}: InstitucionFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<InstitucionFormData>({
    id: institucion?.id ?? 0,
    nombre: institucion?.nombre ?? '',
    tipo: institucion?.tipo ?? '',
    cuit: institucion?.cuit ?? null,
    pais_id: institucion?.pais_id ?? null,
    provincia_id: institucion?.provincia_id ?? null,
    localidad_id: institucion?.localidad_id ?? null,
    pais_texto: null,
    provincia_texto: null,
    localidad_texto: null,
    domicilio: institucion?.domicilio ?? null,
    telefono: institucion?.telefono ?? null,
    email: institucion?.email ?? null,
    web: institucion?.web ?? null,
    activo: institucion?.activo ?? true,
  });

  // Estado para manejar los valores de localización
  const [locationValue, setLocationValue] = useState<LocationValue>({
    pais: null,
    provincia: null,
    localidad: null,
  });

  const loadExistingLocation = async () => {
    if (!institucion) return;
  
    try {
      // Si tiene localidad_id, cargar la jerarquía completa
      if (institucion.localidad_id) {
        const response = await axios.get(route("localizaciones.get-localidad", { localidadId: institucion.localidad_id }));
        const jerarquia = response.data;
        
        setLocationValue({
          pais: jerarquia.pais || null,
          provincia: jerarquia.provincia || null,
          localidad: jerarquia.localidad || null,
        });
        return;
      }
      
      // Si solo tiene provincia_id
      if (institucion.provincia_id) {
        const response = await axios.get(route("localizaciones.get-provincia", { provinciaId: institucion.provincia_id }));
        const data = response.data;
        
        setLocationValue({
          pais: data.pais || null,
          provincia: data.provincia || null,
          localidad: null,
        });
        return;
      }
      
      // Si solo tiene pais_id
      if (institucion.pais_id) {
        const response = await axios.get(route("localizaciones.get-pais", { paisId: institucion.pais_id }));
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


  // Cargar datos existentes al montar el componente
  useEffect(() => {
    if (institucion) {
      setData({
        id: institucion.id,
        nombre: institucion.nombre,
        tipo: institucion.tipo,
        cuit: institucion.cuit,
        pais_id: institucion.pais_id,
        provincia_id: institucion.provincia_id,
        localidad_id: institucion.localidad_id,
        pais_texto: null,
        provincia_texto: null,
        localidad_texto: null,
        domicilio: institucion.domicilio,
        telefono: institucion.telefono,
        email: institucion.email,
        web: institucion.web,
        activo: institucion.activo,
      });
      
      // Cargar la ubicación existente
      loadExistingLocation();
    } else {
      reset();
      setLocationValue({
        pais: null,
        provincia: null,
        localidad: null,
      });
    }
  }, [institucion, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof InstitucionFormData, value);
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

    // Preparar los datos para enviar
    const submitData = { ...data };

    if (isModal) {
      try {
        await axios.post(route(storeRouteName), submitData)
          .then(res => {
            toast.success('Institución creada');
            onSuccess?.(res.data.data);
          })
          .catch(err => {
            console.error('Error al crear institución:', err);
            toast.error('Error al crear institución');
          });
        } catch {
          toast.error('Error al crear la institución', {
            description: 'Revisá los campos del formulario.',
          });
        }
      return;
    }

    const options = {
      onError: (errors: any) => {
        console.error('Errores de validación:', errors);
        toast.error('Error al ' + (institucion ? 'actualizar' : 'crear') + ' la institución', {
          description: 'Revisá los campos del formulario.',
        });
      },
      onSuccess: () => {
        toast.success('Institución ' + (institucion ? 'actualizada' : 'creada'));
        onSuccess?.(submitData as InstitucionType);
      },
    };

    if (institucion) {
      put(route(updateRouteName, institucion.id), options);
    } else {
      post(route(storeRouteName), options);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primera fila: Nombre y Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Nombre *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Nombre de la institución"
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
          <Label className="text-sm font-medium">
            Tipo *
          </Label>
          <ComboBox
            options={tipos}
            value={data.tipo ?? ""}
            onChange={(val) => setData("tipo", val ?? "")}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipo}
            </p>
          )}
        </div>
      </div>

      {/* Segunda fila: CUIT y Web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cuit" className="text-sm font-medium">
            CUIT
          </Label>
          <Input
            id="cuit"
            name="cuit"
            placeholder="Número de CUIT"
            value={data.cuit ?? ''}
            onChange={handleChange}
            className={errors.cuit ? 'border-red-500' : ''}
          />
          {errors.cuit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cuit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="web" className="text-sm font-medium">
            Sitio Web
          </Label>
          <Input
            id="web"
            name="web"
            type="url"
            placeholder="https://www.ejemplo.com"
            value={data.web ?? ''}
            onChange={handleChange}
            className={errors.web ? 'border-red-500' : ''}
          />
          {errors.web && (
            <p className="text-red-500 text-sm mt-1">
              {errors.web}
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

      {/* Cuarta fila: Domicilio */}
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

      {/* Quinta fila: Contacto */}
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

      {/* Debug info - remover en producción 
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-gray-100 rounded text-xs">
          <strong>Debug - Datos de ubicación:</strong>
          <pre>{JSON.stringify({
            pais_id: data.pais_id,
            provincia_id: data.provincia_id,
            localidad_id: data.localidad_id,
            pais_texto: data.pais_texto,
            provincia_texto: data.provincia_texto,
            localidad_texto: data.localidad_texto,
          }, null, 2)}</pre>
        </div>
      )}*/}

      {/* Botón de submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing}
        >
          {processing 
            ? (institucion ? 'Actualizando...' : 'Creando...')
            : (institucion ? 'Actualizar Institución' : 'Crear Institución')
          }
        </Button>
      </div>
    </form>
  );
}
