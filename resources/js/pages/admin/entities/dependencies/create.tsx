import EntidadesLayout from '@/layouts/admin/entidades/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head } from '@inertiajs/react';
import DependenciaUnsaForm from '@/components/forms/dependencia-unsa-form';
import { usePage } from '@inertiajs/react';

export default function CreateDependenciaUnsa() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'DEPENDENCIAS UNSa',
      href: route('entidades.dependenciasUnsa.index'),
    },
    {
      title: 'Nueva Dependencia UNSa',
      href: route('entidades.dependenciasUnsa.create'),
    },
  ];

  const { props } = usePage<{
    tipos: DropdownOption[]
    localidades: DropdownOption[]
    dependencias_padre: DropdownOption[]
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Dependencia" />
      <EntidadesLayout title="Nueva Dependencia" description="Crea una nueva dependencia.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Dependencia</h1>
          <DependenciaUnsaForm {...props} />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}