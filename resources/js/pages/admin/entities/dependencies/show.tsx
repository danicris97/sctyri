import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Dependency } from '@/types/dependency';
import { route } from 'ziggy-js';

export default function ShowDependency() {
  const { dependency } = usePage().props as unknown as { dependency: Dependency };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'DEPENDENCIAS',
      href: route('entidades.dependencies.index'),
    },
    {
      title: `Ver: ${dependency.name}`,
      href: route('entidades.dependencies.show', dependency.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Dependencia" />
      <EntidadesLayout title="Ver Dependencia" description="Ver una dependencia.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Dependencia</h1>

        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
