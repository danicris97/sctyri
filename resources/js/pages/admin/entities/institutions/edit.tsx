import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import InstitucionForm from '@/components/forms/institution-form';
import { type InstitucionType } from '@/schemas/institucion-schema';

export default function EditInstitucion() {
  const { props } = usePage<{
    tipos: DropdownOption[]
    localidades: DropdownOption[]
    provincias : DropdownOption[]
    paises : DropdownOption[]
    institucion: InstitucionType
  }>();

  const { institucion } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'INSTITUCIONES',
      href: route('entidades.instituciones.index'),
    },
    {
      title: `Editar: ${institucion.nombre}`,
      href: route('entidades.instituciones.edit', institucion.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Institución" />
      <EntidadesLayout title="Editar Institución" description="Edita una institución existente en el sistema.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Institución</h1>
          <InstitucionForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
