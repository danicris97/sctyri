import DocumentosLayout from '@/layouts/admin/documentos/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ResolucionForm from '@/components/forms/resolucion-form';
import { type ResolucionType } from '@/schemas/resolucion-schema';

export default function EditResolucion() {
  const { resolucion, tipos, expedientes, resolucion_nombre } = usePage().props as unknown as { 
    resolucion: ResolucionType;
    tipos: { value: string; label: string }[];
    expedientes: { value: string; label: string }[];
    resolucion_nombre: string;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RESOLUCIONES',
      href: route('documentos.resoluciones.index'),
    },
    {
      title: `Editar: ${resolucion_nombre}`,
      href: route('documentos.resoluciones.edit', resolucion.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Resolución" />
      <DocumentosLayout title="Editar Resolución" description="Edita una resolución existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Resolución</h1>
          <ResolucionForm resolucion={resolucion} resoluciones_tipos={tipos} expedientes={expedientes} />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
