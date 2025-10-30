import DocumentsLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FileMovement } from '@/types/file';
import { route } from 'ziggy-js';

export default function ShowMovementFile() {
  const { movement } = usePage().props as unknown as { movement: FileMovement };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'MOVIMIENTOS DE EXPEDIENTES',
      href: route('documents.movements.index'),
    },
    {
      title: `Ver: ${movement.id}`,
      href: route('documents.movements.show', movement.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Movimiento de Expediente" />
      <DocumentsLayout title="Ver Movimiento de Expediente" description="Ver un movimiento de expediente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Movimiento de Expediente</h1>

        </div>
      </DocumentsLayout>
    </AppLayout>
  );
}
