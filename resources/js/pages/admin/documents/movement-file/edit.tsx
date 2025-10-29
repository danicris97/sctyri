import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ExpedienteMovimientoForm from '@/components/forms/expediente-movimiento-form';
import { type ExpedienteMovimientoType } from '@/schemas/expediente-movimiento-schema';
import { route } from 'ziggy-js';

type PageProps = {
  movimiento: ExpedienteMovimientoType;
  expedientes: { value: string; label: string }[];
  dependencias: { value: string; label: string }[];
  expediente_nombre: string;
};

export default function EditMovimiento() {
  const { movimiento, expedientes, dependencias, expediente_nombre } = usePage().props as unknown as PageProps;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'MOVIMIENTOS',
      href: route('documentos.movimientos.index'),
    },
    {
      title: `Editar: ${expediente_nombre}`,
      href: route('documentos.movimientos.edit', movimiento.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Movimiento" />
      <DocumentosLayout title="Editar Movimiento" description="Edita un movimiento existente.">
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold">Editar Movimiento</h1>
          <ExpedienteMovimientoForm
            movimiento={movimiento}
            expedientes={expedientes}
            dependencias={dependencias}
            hideExpedienteSelector
          />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
