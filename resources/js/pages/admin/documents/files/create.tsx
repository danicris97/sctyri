import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head } from '@inertiajs/react';
import FileForm from '@/components/forms/file-form';
import { usePage } from '@inertiajs/react';
import { route } from "ziggy-js";

export default function CreateFile() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'EXPEDIENTES',
      href: route('documents.files.index'),
    },
    {
      title: 'Nuevo Expediente',
      href: route('documents.files.create'),
    },
  ];

  const { props } = usePage<{ 
    types: Option[], 
    dependencies: Option[],
    institutions: Option[],
    persons: Option[],
    positions: Option[],
    person_positions: Option[],
    types_institutions: Option[],
    types_dependencies: Option[],
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Expediente" />
      <DocumentosLayout title="Nuevo Expediente" description="Crea un nuevo expediente.">
        {/* Aquí iría el formulario para crear un nuevo expediente */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Expediente</h1>
          {/* Formulario de creación de expediente */}
          <FileForm {...props}/>
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}