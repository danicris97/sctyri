import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementForm from '@/components/forms/agreement/agreement-form';
import { type Agreement } from '@/types/agreement';
import { route } from 'ziggy-js';

export default function EditAgreement() {
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

  const { agreement } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CONVENIOS',
      href: route("agreement.agreement.index"),
    },
    {
      title: `Editar: ${agreement?.name}`,
      href: route('agreement.agreement.edit', agreement?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Convenio" />
      <AgreementLayout title="Editar Convenio" description="Edita un convenio existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Convenio</h1>
          <AgreementForm 
            { ...props }
            showResolutionSection={false}
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}
