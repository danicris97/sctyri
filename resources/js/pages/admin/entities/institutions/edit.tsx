import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import InstitutionForm from '@/components/forms/institution-form';
import { Institution } from '@/types/institution';
import { route } from "ziggy-js";

export default function EditInstitucion() {
  const { props } = usePage<{
    types: Option[]
    localities: Option[]
    provinces : Option[]
    countries : Option[]
    institution: Institution
  }>();

  const { institution } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'INSTITUCIONES',
      href: route('entities.institutions.index'),
    },
    {
      title: `Editar: ${institution.name}`,
      href: route('entities.institutions.edit', institution.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Institución" />
      <EntidadesLayout title="Editar Institución" description="Edita una institución existente en el sistema.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Institución</h1>
          <InstitutionForm { ...props } />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
