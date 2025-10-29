import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head } from '@inertiajs/react';
import ExpedienteForm from '@/components/forms/expediente-form';
import { usePage } from '@inertiajs/react';

export default function CreateExpediente() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'EXPEDIENTES',
      href: route('documentos.expedientes.index'),
    },
    {
      title: 'Nuevo Expediente',
      href: route('documentos.expedientes.create'),
    },
  ];

  const { props } = usePage<{ 
    tipos: DropdownOption[], 
    dependencias: DropdownOption[],
    instituciones: DropdownOption[],
    personas: DropdownOption[],
    roles: DropdownOption[],
    personas_roles: DropdownOption[],
    tipos_instituciones: DropdownOption[],
    tipos_dependencias: DropdownOption[],
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Expediente" />
      <DocumentosLayout title="Nuevo Expediente" description="Crea un nuevo expediente.">
        {/* Aquí iría el formulario para crear un nuevo expediente */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Expediente</h1>
          {/* Formulario de creación de expediente */}
          <ExpedienteForm {...props}/>
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}