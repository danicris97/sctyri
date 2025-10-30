import DocumentosLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ResolutionForm from '@/components/forms/resolution-form';
import { Resolution } from '@/types/resolution';
import { Option } from '@/types';
import { route } from "ziggy-js";

export default function EditResolution() {
  const { resolution, types, files, resolution_name } = usePage().props as unknown as { 
    resolution: Resolution;
    types: Option[];
    files: Option[];
    resolution_name: string;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RESOLUCIONES',
      href: route('documentos.resoluciones.index'),
    },
    {
      title: `Editar: ${resolution_name}`,
      href: route('documentos.resoluciones.edit', resolution.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Resolución" />
      <DocumentosLayout title="Editar Resolución" description="Edita una resolución existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Resolución</h1>
          <ResolutionForm resolution={resolution} types={types} files={files} fileId={resolution.file_id ?? undefined} />
        </div>
      </DocumentosLayout>
    </AppLayout>
  );
}
