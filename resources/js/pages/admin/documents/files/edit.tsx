import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import FileForm from '@/components/forms/file-form';
import { File } from '@/types/file';
import { route } from "ziggy-js";

export default function EditFile() {
  const { props } = usePage<{ 
    types: Option[], 
    dependencies: Option[],
    institutions: Option[],
    persons: Option[],
    positions: Option[],
    person_positions: Option[],
    types_institutions: Option[],
    types_dependencies: Option[],
    file: File,
  }>();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'EXPEDIENTES',
      href: route('documents.files.index'),
    },
    {
      title: `Editar: ${props.file.number}`,
      href: route('documents.files.edit', props.file.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Expediente" />
      <DocumentosLayout title="Editar Expediente" description="Edita un expediente existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Expediente</h1>
          <FileForm {...props}/>
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
