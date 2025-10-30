import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import RenovacionConvenioForm from '@/components/forms/agreement-renewal-form';

export default function CreateRenovacionConvenio() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('convenios.renovaciones.index'),
    },
    {
      title: `Crear Renovación de Convenio`,
      href: route('convenios.renovaciones.create'),
    },
  ];

  const { props } = usePage<{
    convenios: DropdownOption[];
    resoluciones: { value: string; label: string }[];
    resoluciones_tipos: { value: string; label: string }[];
    expedientes: { value: string; label: string }[];
    convenio?: number | string | null;
  }>()

  const { convenios, resoluciones, resoluciones_tipos, expedientes, convenio } = props;
  const convenioId = typeof convenio === 'number' ? convenio : convenio ? Number(convenio) : undefined;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Renovación de Convenio" />
      <ConveniosLayout title="Crear Renovación de Convenio" description="Crea una renovación de convenio nueva.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Crear Renovación de Convenio</h1>
          <RenovacionConvenioForm
            convenios={convenios}
            resoluciones={resoluciones}
            resoluciones_tipos={resoluciones_tipos}
            expedientes={expedientes}
            convenioId={convenioId}
          />
        </div>
      </ConveniosLayout>
    </AppLayout>
  );
}
