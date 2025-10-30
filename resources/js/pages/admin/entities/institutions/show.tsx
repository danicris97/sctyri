import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Institution } from '@/types/institution';
import { route } from 'ziggy-js';

export default function ShowInstitution() {
  const { institution } = usePage().props as unknown as { institution: Institution };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'INSTITUCIONES',
      href: route('entidades.institutions.index'),
    },
    {
      title: `Ver: ${institution.name}`,
      href: route('entidades.institutions.show', institution.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Institución" />
      <EntidadesLayout title="Ver Institución" description="Ver una institución.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Institución</h1>

        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
