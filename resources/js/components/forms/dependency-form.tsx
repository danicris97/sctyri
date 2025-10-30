import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { type Dependency, DependencyFormData } from '@/types/dependency';
import { Option } from '@/types';

type DependencyFormProps = {
  dependency?: Dependency;
  parent_dependencies?: Option[];
  types: Option[];
  onSuccess?: (dependency: Dependency) => void;
  onSubmit?: (data: DependencyFormData) => Promise<void> | void;
};

export default function DependencyForm({ 
  dependency,
  parent_dependencies = [],
  types = [], 
  onSuccess,
  onSubmit,
}: DependencyFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<DependencyFormData>({
    id: dependency?.id ?? undefined,
    name: dependency?.name ?? '',
    abbreviation: dependency?.abbreviation ?? '',
    parent_dependency_id: dependency?.parent_dependency_id ?? null,
    type: dependency?.type ?? '',
    locality: dependency?.locality ?? null,
    locality_id: dependency?.locality_id ?? null,
    address: dependency?.address ?? '',
    phone: dependency?.phone ?? '',
    email: dependency?.email ?? '',
    active: dependency?.active ?? true,
    webpage: dependency?.webpage ?? '',
  });

  useEffect(() => {
    if (dependency) {
      setData({
        id: dependency.id,
        name: dependency.name,
        abbreviation: dependency.abbreviation,
        parent_dependency_id: dependency.parent_dependency_id,
        type: dependency.type,
        locality: dependency.locality,
        locality_id: dependency.locality_id,
        address: dependency.address,
        phone: dependency.phone,
        email: dependency.email,
        active: dependency.active,
      });
    } else {
      reset();
    }
  }, [dependency, reset, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof DependencyFormData, value);
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
      {/* Primera fila: Nombre y Abreviatura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Nombre completo de la dependencia"
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
          <Label htmlFor="abbreviation" className="text-sm font-medium">
            Abreviatura
          </Label>
          <Input
            id="abbreviation"
            name="abbreviation"
            placeholder="Ejemplo: SCTRI"
            value={data.abbreviation ?? ''}
            onChange={handleChange}
            className={errors.abbreviation ? 'border-red-500' : ''}
          />
          {errors.abbreviation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.abbreviation}
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
            options={types}
            value={data.type ?? ''}
            onChange={(val) => setData('type', val ?? '')}
            placeholder="Seleccione un tipo"
            className="w-full"
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.type}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Dependencia Padre
          </Label>
          <ComboBox
            options={parent_dependencies}
            value={data.parent_dependency_id?.toString() ?? null}
            onChange={(val) => setData('parent_dependency_id', val ? parseInt(val) : null)}
            placeholder="Seleccione la dependencia a la que pertenece"
            className="w-full"
          />
          {errors.parent_dependency_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parent_dependency_id}
            </p>
          )}
        </div>
      </div>

      {/* Tercera fila: Domicilio */}
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

      {/* Cuarta fila: Contacto */}
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

      {/* Quinta fila: Estado */}
      <div className="flex items-center space-x-2 pt-2">
        <Label htmlFor="active" className="text-sm font-medium">
          ¿Esta activo?
        </Label>
        <Checkbox
          id="active"
          checked={data.active}
          onCheckedChange={(checked) => setData('active', !!checked)}
        />
        {errors.active && (
          <p className="text-red-500 text-sm ml-2">
            {errors.active}
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
          {dependency ? 'Actualizar Dependencia' : 'Crear Dependencia'}
        </Button>
      </div>
    </form>
  );
}
