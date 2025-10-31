import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementRenewalForm from '@/components/forms/agreement-renewal-form';
import { route } from 'ziggy-js';

export default function CreateAgreementRenewal() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('agreements.renewals.index'),
    },
    {
      title: `Crear Renovación de Convenio`,
      href: route('agreements.renewals.create'),
    },
  ];

  const { props } = usePage<{
    agreements: Option[];
    resolutions: Option[];
    resolution_types: Option[];
    files: Option[];
    agreement?: number | string | null;
  }>()

  const { agreements, resolutions, resolution_types, files, agreement } = props;
  const agreementId = typeof agreement === 'number' ? agreement : agreement ? Number(agreement) : undefined;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Renovación de Convenio" />
      <AgreementLayout title="Crear Renovación de Convenio" description="Crea una renovación de convenio nueva.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Crear Renovación de Convenio</h1>
          <AgreementRenewalForm
            agreements={agreements}
            resolutions={resolutions}
            resolutions_types={resolution_types}
            files={files}
            agreementId={agreementId}
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}
