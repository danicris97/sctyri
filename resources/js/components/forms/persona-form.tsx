import { useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import React, { useEffect, useState } from 'react';
import { type PersonaType } from '@/schemas/persona-schema';
import { LocationFields } from '@/components/ui/localizacion-field';
import { type LocationValue } from '@/components/ui/localizacion-field';
import { type LocationDataType } from '@/schemas/ubicacion-schemas';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownOption } from '@/types';

type PersonaFormData = PersonaType & {
  pais_texto?: string | null;
  provincia_texto?: string | null;
  localidad_texto?: string | null;
};

type PersonaFormProps = {
    persona?: PersonaType;
    errors?: Record<string, string>;
    onSuccess?: (personaRol: PersonaType) => void;
    onSubmit?: (data: PersonaFormData) => Promise<void> | void;
    isModal?: boolean;
};

export default function PersonaRolForm({
    persona,
    errors = {},
    onSubmit,
}: PersonaFormProps) {
    // Asegurar que sean arrays válidos
    const [buscarExistente, setBuscarExistente] = useState(false);
    const [locationValue, setLocationValue] = useState<LocationValue>({
        pais: null,
        provincia: null,
        localidad: null,
    });
    
    const { data, setData, processing, reset } = useForm<PersonaFormData>({
        id: persona?.id ?? 0,
        nombre: persona?.nombre ?? '',
        apellido: persona?.apellido ?? '',
        dni: persona?.dni ?? null,
        activo: persona?.activo ?? true,
        pais_id: persona?.pais_id ?? null,
        provincia_id: persona?.provincia_id ?? null,
        localidad_id: persona?.localidad_id ?? null,
        domicilio: persona?.domicilio ?? null,
        telefono: persona?.telefono ?? null,
        email: persona?.email ?? null,
        pais_texto: null,
        provincia_texto: null, 
        localidad_texto: null,
    });

    // Función para cargar datos de ubicación por ID - REMOVIDA (ahora la maneja LocationFields)

    useEffect(() => {
        if (personaRol) {
            setData({
                id: personaRol.id,
                activo: personaRol.activo,
                rol: personaRol.rol ?? null,
                persona_id: personaRol.persona_id,
                persona: personaRol.persona,
                pais_texto: null,
                provincia_texto: null,
                localidad_texto: null,
            });

            // Ya no necesitamos cargar datos de ubicación aquí - LocationFields lo hará
        } else {
            reset();
            setLocationValue({
                pais: null,
                provincia: null,
                localidad: null,
            });
        }
    }, [personaRol, reset, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Manejar campos anidados de persona
        if (name.startsWith('persona.')) {
            const personaField = name.split('.')[1] as keyof typeof data.persona;
            setData('persona', {
                ...data.persona,
                [personaField]: value || null,
            });
        } else {
            setData(name as keyof PersonaRolFullType, value);
        }
    };
    
    const handleLocationChange = (newLocationValue: LocationValue, extractedData: LocationDataType) => {
        setLocationValue(newLocationValue);
        
        // Actualizar los campos de ubicación en la persona
        setData(prevData => ({
            ...prevData,
            persona: {
                ...prevData.persona,
                pais_id: extractedData.pais_id,
                provincia_id: extractedData.provincia_id,
                localidad_id: extractedData.localidad_id,
            },
            pais_texto: extractedData.pais_texto,
            provincia_texto: extractedData.provincia_texto,
            localidad_texto: extractedData.localidad_texto,
        }));
    };

    const handleToggleBuscarExistente = (checked: boolean) => {
        setBuscarExistente(checked);
        
        if (!checked) {
            // Si desactivamos la búsqueda, limpiamos la persona seleccionada
            setData('persona_id', null);
            setData('persona', {
                id: 0,
                nombre: '',
                apellido: '',
                dni: null,
                activo: true,
                pais_id: null,
                provincia_id: null,
                localidad_id: null,
                domicilio: null,
                telefono: null,
                email: null,
            });
            setLocationValue({
                pais: null,
                provincia: null,
                localidad: null,
            });
        }
    };

    const handleSelectPersona = async (personaId: string | null) => {
        if (!personaId) {
          setData('persona_id', null)
          return
        }
        const id = Number(personaId)
        setData('persona_id', id)  

        const personaSeleccionada = personas.find(p => p.value === personaId)
        
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (onSubmit) {
          await onSubmit(data); // delegás la acción
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de persona existente */}
            {!personaRol && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="buscarExistente"
                            checked={buscarExistente}
                            onCheckedChange={handleToggleBuscarExistente}
                        />
                        <Label htmlFor="buscarExistente">
                            Buscar persona existente
                        </Label>
                    </div>
                    
                    {buscarExistente && (
                        <div className="space-y-2">
                            <Label>Seleccionar Persona</Label>
                            <ComboBox
                                options={validPersonas}
                                value={data.persona_id ? String(data.persona_id) : null}
                                onChange={handleSelectPersona}
                                placeholder="Buscar por DNI o nombre..."
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Mostrar loading mientras se cargan los datos de ubicación - REMOVIDO */}

            {/* Sección de Datos Personales */}
            <div className="border-b pb-4">
                <h3 className="text-lg font-medium">Datos Personales</h3>
            </div>

            {/* Primera fila: Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="persona.nombre" className="text-sm font-medium">
                        Nombre *
                    </Label>
                    <Input
                        id="persona.nombre"
                        name="persona.nombre"
                        placeholder="Nombre de la persona"
                        value={data.persona.nombre}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors?.['persona.nombre'] ? 'border-red-500' : ''}
                    />
                    {errors?.['persona.nombre'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.nombre']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="persona.apellido" className="text-sm font-medium">
                        Apellido *
                    </Label>
                    <Input
                        id="persona.apellido"
                        name="persona.apellido"
                        placeholder="Apellido de la persona"
                        value={data.persona.apellido}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors['persona.apellido'] ? 'border-red-500' : ''}
                    />
                    {errors['persona.apellido'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.apellido']}</p>
                    )}
                </div>
            </div>

            {/* Segunda fila: DNI y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="persona.dni" className="text-sm font-medium">
                        DNI
                    </Label>
                    <Input
                        id="persona.dni"
                        name="persona.dni"
                        placeholder="DNI de la persona"
                        value={data.persona.dni ?? ''}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors['persona.dni'] ? 'border-red-500' : ''}
                    />
                    {errors['persona.dni'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.dni']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="persona.email" className="text-sm font-medium">
                        Email
                    </Label>
                    <Input
                        id="persona.email"
                        name="persona.email"
                        type="email"
                        placeholder="Email de la persona"
                        value={data.persona.email ?? ''}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors['persona.email'] ? 'border-red-500' : ''}
                    />
                    {errors['persona.email'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.email']}</p>
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
                    disabled={buscarExistente}
                    initialPaisId={data.persona?.pais_id || null}
                    initialProvinciaId={data.persona?.provincia_id || null}
                    initialLocalidadId={data.persona?.localidad_id || null}
                />
            </div>

            {/* Cuarta fila: Domicilio y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="persona.domicilio" className="text-sm font-medium">
                        Domicilio
                    </Label>
                    <Input
                        id="persona.domicilio"
                        name="persona.domicilio"
                        placeholder="Domicilio de la persona"
                        value={data.persona.domicilio ?? ''}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors['persona.domicilio'] ? 'border-red-500' : ''}
                    />
                    {errors['persona.domicilio'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.domicilio']}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="persona.telefono" className="text-sm font-medium">
                        Teléfono
                    </Label>
                    <Input
                        id="persona.telefono"
                        name="persona.telefono"
                        placeholder="Teléfono de la persona"
                        value={data.persona.telefono ?? ''}
                        onChange={handleChange}
                        disabled={buscarExistente}
                        className={errors['persona.telefono'] ? 'border-red-500' : ''}
                    />
                    {errors['persona.telefono'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['persona.telefono']}</p>
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
                        Rol *
                    </Label>
                    <ComboBox
                        options={roles}
                        value={data.rol}
                        onChange={(val) => setData('rol', val)}
                        placeholder="Seleccione un rol"
                        className="w-full"
                    />
                    {errors['rol'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['rol']}</p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                        id="activo"
                        checked={data.activo}
                        onCheckedChange={(checked) => setData('activo', !!checked)}
                    />
                    <Label htmlFor="activo" className="text-sm font-medium">
                        ¿Está activo?
                    </Label>
                    {errors['activo'] && (
                        <p className="text-red-500 text-sm ml-2">{errors['activo']}</p>
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
                        ? (personaRol ? 'Actualizando...' : 'Creando...') 
                        : (personaRol ? 'Actualizar Firmante' : 'Crear Firmante')
                    }
                </Button>
            </div>
        </form>
    );
}