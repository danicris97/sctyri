import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { type Option } from '@/types';
import { PersonPosition, PersonPositionFormData } from '@/types/person';

type PersonPositionFormProps = {
    personPosition?: PersonPosition;
    persons: Option[];
    positions: Option[];
    errors?: Record<string, string>;
    onSuccess?: (personPosition: PersonPosition) => void;
    onSubmit?: (data: PersonPositionFormData) => Promise<void> | void;
};

export default function PersonPositionForm({
    personPosition,
    persons = [],
    positions = [],
    errors = {},
    onSubmit,
}: PersonPositionFormProps) {
    const { data, setData, processing, reset } = useForm<PersonPositionFormData>({
        id: personPosition?.id ?? 0,
        position: personPosition?.position ?? '',
        active: personPosition?.active ?? true,
        person_id: personPosition?.person_id ?? null,
        person: {
            id: personPosition?.person?.id ?? 0,
            name: personPosition?.person?.name ?? '',
            surname: personPosition?.person?.surname ?? '',
            dni: personPosition?.person?.dni ?? null,
            email: personPosition?.person?.email ?? null,
            phone: personPosition?.person?.phone ?? null,
            address: personPosition?.person?.address ?? null,
            nationality: personPosition?.person?.nationality ?? null,
        }
    });

    const [searchFile, setSearchFile] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('person.')) {
            const personField = name.split('.')[1] as keyof typeof data.person;
            setData('person', {
                ...data.person,
                [personField]: value || null,
            });
        } else {
            setData(name as keyof PersonPositionFormData, Number(value));
        }
    };

    const handleToggleSearchFile = (checked: boolean) => {
        setSearchFile(checked);
        
        if (!checked) {
            setData('person_id', null);
            setData('person', {
                id: 0,
                name: '',
                surname: '',
                dni: null,
                email: null,
                phone: null,
                address: null,
                nationality: null,
            });
        }
    };

    const handleSelectPerson = async (personId: string | null) => {
        if (!personId) {
          setData('person_id', null)
          return
        }
        const id = Number(personId)
        setData('person_id', id)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (onSubmit) {
          await onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de persona existente */}
            {!personPosition && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="searchFile"
                            checked={searchFile}
                            onCheckedChange={handleToggleSearchFile}
                        />
                        <Label htmlFor="searchFile">
                            Buscar persona existente
                        </Label>
                    </div>
                    
                    {searchFile && (
                        <div className="space-y-2">
                            <Label>Seleccionar Persona</Label>
                            <ComboBox
                                options={persons}
                                value={data.person_id ? data.person_id : null}
                                onChange={handleSelectPerson}
                                placeholder="Buscar por DNI o nombre..."
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Sección de Datos Personales */}
            <div className="border-b pb-4">
                <h3 className="text-lg font-medium">Datos Personales</h3>
            </div>

            {/* Primera fila: Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="person.name" className="text-sm font-medium">
                        Nombre *
                    </Label>
                    <Input
                        id="person.name"
                        name="person.name"
                        placeholder="Nombre de la persona"
                        value={data.person.name}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors?.['person.name'] ? 'border-red-500' : ''}
                    />
                    {errors?.['person.name'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.name']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="person.surname" className="text-sm font-medium">
                        Apellido *
                    </Label>
                    <Input
                        id="person.surname"
                        name="person.surname"
                        placeholder="Apellido de la persona"
                        value={data.person.surname}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors['person.surname'] ? 'border-red-500' : ''}
                    />
                    {errors['person.surname'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.surname']}</p>
                    )}
                </div>
            </div>

            {/* Segunda fila: DNI y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="person.dni" className="text-sm font-medium">
                        DNI
                    </Label>
                    <Input
                        id="person.dni"
                        name="person.dni"
                        placeholder="DNI de la persona"
                        value={data.person.dni ?? ''}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors['person.dni'] ? 'border-red-500' : ''}
                    />
                    {errors['person.dni'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.dni']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="person.email" className="text-sm font-medium">
                        Email
                    </Label>
                    <Input
                        id="person.email"
                        name="person.email"
                        type="email"
                        placeholder="Email de la persona"
                        value={data.person.email ?? ''}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors['person.email'] ? 'border-red-500' : ''}
                    />
                    {errors['person.email'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.email']}</p>
                    )}
                </div>
            </div>

            {/* Cuarta fila: Domicilio y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="person.address" className="text-sm font-medium">
                        Domicilio
                    </Label>
                    <Input
                        id="person.address"
                        name="person.address"
                        placeholder="Domicilio de la persona"
                        value={data.person.address ?? ''}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors['person.address'] ? 'border-red-500' : ''}
                    />
                    {errors['person.address'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.address']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="person.phone" className="text-sm font-medium">
                        Teléfono
                    </Label>
                    <Input
                        id="person.phone"
                        name="person.phone"
                        placeholder="Teléfono de la persona"
                        value={data.person.phone ?? ''}
                        onChange={handleChange}
                        disabled={searchFile}
                        className={errors['person.phone'] ? 'border-red-500' : ''}
                    />
                    {errors['person.phone'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['person.phone']}</p>
                    )}
                </div>
            </div>

            {/* Sección de Información de Firmante */}
            <div className="border-b pb-4 mt-6">
                <h3 className="text-lg font-medium">Información</h3>
            </div>

            {/* Quinta fila: Cargo y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Cargo *
                    </Label>
                    <ComboBox
                        options={positions}
                        value={data.position ?? null}
                        onChange={(val) => setData('position',val ?? '')}
                        placeholder="Seleccione un cargo"
                        className="w-full"
                    />
                    {errors['position'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['position']}</p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                        id="active"
                        checked={data.active}
                        onCheckedChange={(checked) => setData('active', !!checked)}
                    />
                    <Label htmlFor="active" className="text-sm font-medium">
                        ¿Está activo?
                    </Label>
                    {errors['active'] && (
                        <p className="text-red-500 text-sm ml-2">{errors['active']}</p>
                    )}
                </div>
            </div>

            {/* Botón de submit */}
            <div className="flex justify-end pt-6">
                <Button
                    type="submit"
                    className="bg-[#0e3b65] hover:bg-[#1e5b95] text-white"
                    disabled={processing}
                >
                    {processing 
                        ? (personPosition ? 'Actualizando...' : 'Creando...') 
                        : (personPosition ? 'Actualizar Firmante' : 'Crear Firmante')
                    }
                </Button>
            </div>
        </form>
    );
}