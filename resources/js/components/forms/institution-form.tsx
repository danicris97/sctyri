import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { useEffect } from 'react';
import { type Institution, InstitutionFormData } from '@/types/institution';
import { ComboBox } from "@/components/ui/combobox";
import { Option } from '@/types';

type InstitutionFormProps = {
  institution?: Institution;
  types: Option[];
  onSuccess?: (institution: Institution) => void;
  onSubmit?: (data: InstitutionFormData) => Promise<void> | void;
};

export default function InstitutionForm({ 
  institution, 
  types = [], 
  onSuccess,
  onSubmit,
}: InstitutionFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<InstitutionFormData>({
    id: institution?.id ?? undefined,
    name: institution?.name ?? '',
    type: institution?.type ?? '',
    cuit: institution?.cuit ?? null,
    country_id: institution?.country_id ?? null,
    country: institution?.country ?? '',
    province_id: institution?.province_id ?? null,
    province: institution?.province ?? '',
    locality_id: institution?.locality_id ?? null,
    locality: institution?.locality ?? '',
    address: institution?.address ?? null,
    phone: institution?.phone ?? null,
    email: institution?.email ?? null,
    web: institution?.web ?? null,
    active: institution?.active ?? true,
  });

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    if (institution) {
      setData({
        id: institution.id,
        name: institution.name,
        type: institution.type,
        cuit: institution.cuit,
        country_id: institution.country_id,
        country: institution.country,
        province_id: institution.province_id,
        province: institution.province,
        locality_id: institution.locality_id,
        locality: institution.locality,
        address: institution.address,
        phone: institution.phone,
        email: institution.email,
        web: institution.web,
        active: institution.active,
      });
    } else {
      reset();
    }
  }, [institution, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof InstitutionFormData, value);
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
      {/* Primera fila: Nombre y Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Nombre de la institución"
            value={data.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tipo *
          </Label>
          <ComboBox
            options={types}
            value={data.type ?? ""}
            onChange={(val) => setData("type", val ?? "")}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.type}
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

      {/* Cuarta fila: Domicilio */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Domicilio
        </Label>
        <Input
          id="address"
          name="address"
          placeholder="Dirección completa"
          value={data.address ?? ''}
          onChange={handleChange}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.address}
          </p>
        )}
      </div>

      {/* Quinta fila: Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Número de teléfono"
            value={data.phone ?? ''}
            onChange={handleChange}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone}
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

      {/* Botón de submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
          disabled={processing}
        >
          {processing 
            ? (institution ? 'Actualizando...' : 'Creando...')
            : (institution ? 'Actualizar Institución' : 'Crear Institución')
          }
        </Button>
      </div>
    </form>
  );
}
