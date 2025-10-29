import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ConvenioForm from '@/components/forms/convenio/convenio-form';
import { type ConvenioFullType } from '@/schemas/convenio-schema';

export default function CreateConvenio() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CONVENIOS',
      href: route("convenios.convenios.index"),
    },
    {
      title: 'Nuevo Convenio',
      href: route("convenios.convenios.create"),
    },
  ];

  const { props } = usePage<{
    convenios_tipos: DropdownOption[]
    resoluciones_tipos: DropdownOption[]
    instituciones: DropdownOption[]
    instituciones_tipos: DropdownOption[]
    unidades_academicas: DropdownOption[]
    unidades_academicas_tipos: DropdownOption[]
    firmantes_unsa: DropdownOption[]
    expedientes: DropdownOption[]
    expedientes_tipos: DropdownOption[]
    personas: DropdownOption[]
    roles: DropdownOption[]
    renovaciones_convenios_tipos: DropdownOption[]
    convenio?: ConvenioFullType
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Convenio" />
      <ConveniosLayout title="Nuevo Convenio" description="Crea un nuevo convenio.">
        {/* Aquí iría el formulario para crear un nuevo convenio */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Convenio</h1>
          {/* Formulario de creación de convenio */}
          <ConvenioForm
            { ...props }
          />
        </div>
      </ConveniosLayout>
    </AppLayout>
  );
}