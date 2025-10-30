import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ExpedienteForm from '@/components/forms/file-form';
import { type ExpedienteType } from '@/schemas/expediente-schema';

export default function EditExpediente() {
  const { props } = usePage<{ 
    tipos: DropdownOption[], 
    dependencias: DropdownOption[],
    instituciones: DropdownOption[],
    personas: DropdownOption[],
    roles: DropdownOption[],
    personas_roles: DropdownOption[],
    tipos_instituciones: DropdownOption[],
    tipos_dependencias: DropdownOption[],
    expediente: ExpedienteType,
  }>();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'EXPEDIENTES',
      href: route('documentos.expedientes.index'),
    },
    {
      title: `Editar: ${props.expediente.numero}`,
      href: route('documentos.expedientes.edit', props.expediente.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Expediente" />
      <DocumentosLayout title="Editar Expediente" description="Edita un expediente existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Expediente</h1>
          <ExpedienteForm {...props}/>
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
