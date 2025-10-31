import AgreementLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementCancellationForm from '@/components/forms/agreement-cancellation-form';
import { route } from 'ziggy-js';

export default function CreateAgreementCancellation() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'BAJAS DE CONVENIOS',
      href: route('agreements.cancellations.index'),
    },
    {
      title: 'Nueva Baja de Convenio',
      href: route('agreements.cancellations.create'),
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
      <Head title="Nueva Baja de Convenio" />
      <AgreementLayout title="Nueva Baja de Convenio" description="Crea una nueva baja de convenio para los convenios.">
        {/* Aquí iría el formulario para crear una nueva institución */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Baja de Convenio</h1>
          {/* Formulario de creación de baja de convenio */}
          <AgreementCancellationForm
            agreements={agreements}
            resolutions={resolutions}
            resolution_types={resolution_types}
            files={files}
            agreementId={agreementId}
          />
        </div>
      </AgreementLayout>
    </AppLayout>
  );
}
