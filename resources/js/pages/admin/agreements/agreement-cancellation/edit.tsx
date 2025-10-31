import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementCancellationForm from '@/components/forms/agreement-cancellation-form';
import { AgreementCancellation } from '@/types/agreement';
import { route } from 'ziggy-js';

export default function EditAgreementCancellation() {
  const { props } = usePage<{ 
    agreements: Option[], 
    resolutions: Option[], 
    agreement_name: string,
    resolution_types: Option[],
    files: Option[],
    agreement_cancellation?: AgreementCancellation
  }>()

  const { agreement_cancellation, agreement_name } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'BAJAS DE CONVENIOS',
      href: route('agreements.cancellations.index'),
    },
    {
      title: `Editar: ${agreement_name}`,
      href: route('agreements.cancellations.edit', agreement_cancellation?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Baja de Convenio" />
      <AgreementLayout title="Editar Baja de Convenio" description="Edita una baja de convenio existente para los convenios.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Baja de Convenio</h1>
          <AgreementCancellationForm
            {...props}
            hideAgreementSelector
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}
