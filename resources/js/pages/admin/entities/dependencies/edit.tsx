import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DependenciaUnsaForm from '@/components/forms/dependencia-unsa-form';
import { type DependenciaUnsaType } from '@/schemas/dependencia-unsa-schema';

export default function EditDependenciaUnsa() {
  const { props } = usePage<{
    tipos: DropdownOption[]
    localidades: DropdownOption[]
    dependencias_padre: DropdownOption[]
    dependenciaUnsa?: DependenciaUnsaType
  }>();

  const { dependenciaUnsa } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'DEPENDENCIAS UNSa',
      href: route('entidades.dependenciasUnsa.index'),
    },
    {
      title: `Editar: ${dependenciaUnsa?.nombre}`,
      href: route('entidades.dependenciasUnsa.edit', dependenciaUnsa?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Dependencia" />
      <EntidadesLayout title="Editar Dependencia" description="Edita una dependencia del sistema.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Dependencia</h1>
          <DependenciaUnsaForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}