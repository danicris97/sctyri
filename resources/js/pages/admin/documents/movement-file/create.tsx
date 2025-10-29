import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ExpedienteMovimientoForm from '@/components/forms/expediente-movimiento-form';
import { route } from 'ziggy-js';

type PageProps = {
  expedientes: { value: string; label: string }[];
  dependencias: { value: string; label: string }[];
  expediente?: number;
};

export default function CreateMovimiento() {
  const { expedientes, dependencias, expediente } = usePage().props as unknown as PageProps;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'MOVIMIENTOS',
      href: route('documentos.movimientos.index'),
    },
    {
      title: 'Nuevo Movimiento',
      href: route('documentos.movimientos.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Movimiento" />
      <DocumentosLayout title="Nuevo Movimiento" description="Crea un nuevo movimiento.">
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold">Agregar Nuevo Movimiento</h1>
          <ExpedienteMovimientoForm expedientes={expedientes} dependencias={dependencias} expedienteId={expediente} />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
