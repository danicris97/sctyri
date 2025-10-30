import DocumentsLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { File } from '@/types/file';
import { route } from 'ziggy-js';

export default function ShowFile() {
  const { file } = usePage().props as unknown as { file: File };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'EXPEDIENTES',
      href: route('documents.files.index'),
    },
    {
      title: `Ver: ${file.number}`,
      href: route('documents.files.show', file.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Expediente" />
      <DocumentsLayout title="Ver Expediente" description="Ver un expediente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Expediente</h1>

        </div>
      </DocumentsLayout>
    </AppLayout>
  );
}
