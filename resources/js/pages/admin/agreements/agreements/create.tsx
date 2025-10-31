import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementForm from '@/components/forms/agreement/agreement-form';
import { Agreement } from '@/types/agreement';
import { route } from 'ziggy-js';

export default function CreateAgreement() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CONVENIOS',
      href: route("agreement.agreement.index"),
    },
    {
      title: 'Nuevo Convenio',
      href: route("agreement.agreement.create"),
    },
  ];

  const { props } = usePage<{
    agreements_types: Option[]
    resolutions_types: Option[]
    institutions: Option[]
    institutions_types: Option[]
    dependencies: Option[]
    dependencies_types: Option[]
    person_positions: Option[]
    persons: Option[]
    positions: Option[]
    agreements_renewal_types: Option[]
    resolutions: Option[]
    agreement?: Agreement
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Convenio" />
      <AgreementLayout title="Nuevo Convenio" description="Crea un nuevo convenio.">
        {/* Aquí iría el formulario para crear un nuevo convenio */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Convenio</h1>
          {/* Formulario de creación de convenio */}
          <AgreementForm
            { ...props }
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}