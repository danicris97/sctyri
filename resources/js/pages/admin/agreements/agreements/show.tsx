import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function ShowAgreement() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CONVENIOS',
      href: route('agreements.agreements.index'),
    },
    {
      title: 'Ver Convenio',
      href: route('agreements.agreements.show'),
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
      <Head title="Ver Convenio" />
      <AgreementLayout title="Ver Convenio" description="Ver un convenio para los convenios.">
    
      </AgreementLayout>
    </AppLayout>
  );
}
