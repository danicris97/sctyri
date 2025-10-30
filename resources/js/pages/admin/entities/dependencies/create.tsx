import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head } from '@inertiajs/react';
import DependencyForm from '@/components/forms/dependency-form';
import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CreateDependency() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'DEPENDENCIAS',
      href: route('entidades.dependencies.index'),
    },
    {
      title: 'Nueva Dependencia',
      href: route('entidades.dependencies.create'),
    },
  ];

  const { props } = usePage<{
    types: Option[]
    localities: Option[]
    patern_dependencies: Option[]
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Dependencia" />
      <EntidadesLayout title="Nueva Dependencia" description="Crea una nueva dependencia.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Dependencia</h1>
          <DependencyForm {...props} />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}