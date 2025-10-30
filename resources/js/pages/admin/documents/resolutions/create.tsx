import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ResolutionForm from '@/components/forms/resolution-form';
import { route } from "ziggy-js";
import { Option } from '@/types';

export default function CreateResolution() {
  const { types, files, fileId } = usePage().props as unknown as {
    types: Option[];
    files: Option[];
    fileId?: number;
  };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RESOLUCIONES',
      href: route('documents.resolutions.index'),
    },
    {
      title: 'Nueva Resolución',
      href: route('documents.resolutions.create'),
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
          <ResolutionForm types={types} files={files} fileId={fileId} />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}