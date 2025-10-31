import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementRenewalForm from '@/components/forms/agreement-renewal-form';
import {AgreementRenewal } from '@/types/agreement';
import { route } from "ziggy-js";

export default function EditAgreementRenewal() {
  const { props } = usePage<{
    agreementRenewal?: AgreementRenewal;
    agreements: Option[];
    agreement_name: string;
    resolutions: Option[];
    resolutions_types: Option[];
    files: Option[];
  }>();

  const { agreementRenewal, agreement_name } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('agreement.renewals.index'),
    },
  ];

  if (agreementRenewal?.id) {
    breadcrumbs.push({
      title: `Editar: ${agreement_name}`,
      href: route('agreement.renewals.edit', { agreementRenewal: agreementRenewal.id }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Renovación de Convenio" />
      <AgreementLayout
        title="Editar Renovación de Convenio"
        description="Edita una renovación de convenio existente."
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Renovación de Convenio</h1>
          <AgreementRenewalForm
            {...props}
            hideAgreementSelector
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}
