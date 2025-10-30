import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import InstitutionForm from '@/components/forms/institution-form';
import { route } from "ziggy-js";

export default function CreateInstitucion() {
  const { props } = usePage<{
    types: Option[],
    localities: Option[],
    provinces: Option[],
    countries: Option[],
  }>();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'INSTITUCIONES',
      href: route('entities.institutions.index'),
    },
    {
      title: 'Nueva Institución',
      href: route('entities.institutions.create'),
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
          <InstitutionForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}