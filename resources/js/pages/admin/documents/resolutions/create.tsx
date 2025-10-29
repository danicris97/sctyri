import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ResolucionForm from '@/components/forms/resolucion-form';

export default function CreateResolucion() {
  const { tipos, expedientes, expediente } = usePage().props as unknown as {
    tipos: { value: string; label: string }[];
    expedientes: { value: string; label: string }[];
    expediente?: number;
  };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RESOLUCIONES',
      href: route('documentos.resoluciones.index'),
    },
    {
      title: 'Nueva Resolución',
      href: route('documentos.resoluciones.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Resolución" />
      <DocumentosLayout title="Nueva Resolución" description="Crea una nueva resolución.">
        {/* Aquí iría el formulario para crear una nueva resolución */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Resolución</h1>
          {/* Formulario de creación de resolución */}
          <ResolucionForm resoluciones_tipos={tipos} expedientes={expedientes} expedienteId={expediente} />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}