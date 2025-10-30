import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import InstitucionForm from '@/components/forms/institution-form';

export default function CreateInstitucion() {
  const { props } = usePage<{
    tipos: DropdownOption[]
  }>();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'INSTITUCIONES',
      href: route('entidades.instituciones.index'),
    },
    {
      title: 'Nueva Institución',
      href: route('entidades.instituciones.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Institución" />
      <EntidadesLayout title="Nueva Institución" description="Agrega una nueva institucion al sistema.">
        {/* Aquí iría el formulario para crear una nueva institución */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Institución</h1>
          {/* Formulario de creación de institución */}
          <InstitucionForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}