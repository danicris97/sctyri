import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DependencyForm from '@/components/forms/dependency-form';
import { Dependency } from '@/types/dependency';
import { route } from 'ziggy-js';

export default function EditDependency() {
  const { props } = usePage<{
    types: Option[]
    localities: Option[]
    patern_dependencies: Option[]
    dependency?: Dependency
  }>();

  const { dependency } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'DEPENDENCIAS',
      href: route('entidades.dependencies.index'),
    },
    {
      title: `Editar: ${dependency?.name}`,
      href: route('entidades.dependencies.edit', dependency?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Dependencia" />
      <EntidadesLayout title="Editar Dependencia" description="Edita una dependencia del sistema.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Dependencia</h1>
          <DependencyForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}