import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function ShowAgreementRenewal() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('agreements.renewals.index'),
    },
    {
      title: 'Ver Renovación',
      href: route('agreements.renewals.show'),
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
      <Head title="Ver Renovación de Convenio" />
      <AgreementLayout title="Ver Renovación de Convenio" description="Ver una renovación de convenio para los convenios.">
    
      </AgreementLayout>
    </AppLayout>
  );
}
