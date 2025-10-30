import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Option } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AgreementRenewalForm from '@/components/forms/agreement-renewal-form';
import {AgreementRenewal } from '@/types/agreement';
import { route } from "ziggy-js";

export default function EditRenovacionConvenio() {
  const { props } = usePage<{
    agreementRenewal?: AgreementRenewal;
    convenios: Option[];
    convenio_nombre: string;
    resoluciones: Option[];
    resoluciones_tipos: Option[];
    expedientes: Option[];
  }>();

  const { agreementRenewal, convenio_nombre } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('agreement.renovaciones.index'),
    },
  ];

  if (agreementRenewal?.id) {
    breadcrumbs.push({
      title: `Editar: ${convenio_nombre}`,
      href: route('agreement.renovaciones.edit', { agreementRenewal: agreementRenewal.id }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Renovación de Convenio" />
      <ConveniosLayout
        title="Editar Renovación de Convenio"
        description="Edita una renovación de convenio existente."
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Renovación de Convenio</h1>
          <RenovacionConvenioForm
            {...props}
            hideConvenioSelector
          />
        </div>
      </ConveniosLayout>
    </AppLayout>
  );
}
