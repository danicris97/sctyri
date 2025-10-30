import DocumentsLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import FileMovementForm from '@/components/forms/file-movement-form';
import { route } from 'ziggy-js';

type MovementFileCreateProps = {
  files: Option[];
  dependencies: Option[];
  file?: number;
};

export default function CreateMovementFile() {
  const { files, dependencies, file } = usePage().props as unknown as MovementFileCreateProps;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'MOVIMIENTOS',
      href: route('documents.movements.index'),
    },
    {
      title: 'Nuevo Movimiento',
      href: route('documents.movements.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Movimiento" />
      <DocumentsLayout title="Nuevo Movimiento" description="Crea un nuevo movimiento.">
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold">Agregar Nuevo Movimiento</h1>
          <FileMovementForm files={files} dependencies={dependencies} file_id={file} />
        </div>
      </DocumentsLayout>
    </AppLayout>
  );
}
