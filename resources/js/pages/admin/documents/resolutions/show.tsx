import DocumentsLayout from '@/layouts/admin/documents/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Resolution } from '@/types/resolution';
import { route } from 'ziggy-js';

export default function ShowResolution() {
  const { resolution } = usePage().props as unknown as { resolution: Resolution };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RESOLUCIONES',
      href: route('documents.resolutions.index'),
    },
    {
      title: `Ver: ${resolution.name}`,
      href: route('documents.resolutions.show', resolution.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Resolución" />
      <DocumentsLayout title="Ver Resolución" description="Ver una resolución.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Resolución</h1>

        </div>
      </DocumentsLayout>
    </AppLayout>
  );
}
