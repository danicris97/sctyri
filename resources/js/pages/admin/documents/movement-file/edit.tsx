import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { FileMovement } from '@/types/file';
import { Head, usePage } from '@inertiajs/react';
import FileMovementForm from '@/components/forms/file-movement-form';
import { route } from 'ziggy-js';

type EditMovementFileProps = {
  file_movement: FileMovement;
  files: Option[];
  dependencies: Option[];
  file_name: string;
};

export default function EditMovementFile() {
  const { file_movement, files, dependencies, file_name } = usePage().props as unknown as EditMovementFileProps;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'MOVIMIENTOS',
      href: route('documentos.movimientos.index'),
    },
    {
      title: `Editar: ${file_name}`,
      href: route('documentos.movimientos.edit', file_movement.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Movimiento" />
      <DocumentosLayout title="Editar Movimiento" description="Edita un movimiento existente.">
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold">Editar Movimiento</h1>
          <FileMovementForm
            file_movement={file_movement}
            files={files}
            dependencies={dependencies}
            hideFileSelector
          />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
