import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import RenovacionConvenioForm from '@/components/forms/renovacion-convenio-form';
import { type RenovacionConvenioType } from '@/schemas/renovacion-convenio-schema';

export default function EditRenovacionConvenio() {
  const { props } = usePage<{
    renovacionConvenio?: RenovacionConvenioType;
    convenios: DropdownOption[];
    convenio_nombre: string;
    resoluciones: { value: string; label: string }[];
    resoluciones_tipos: { value: string; label: string }[];
    expedientes: { value: string; label: string }[];
  }>();

  const { renovacionConvenio, convenio_nombre } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'RENOVACIONES DE CONVENIOS',
      href: route('convenios.renovaciones.index'),
    },
  ];

  if (renovacionConvenio?.id) {
    breadcrumbs.push({
      title: `Editar: ${convenio_nombre}`,
      href: route('convenios.renovaciones.edit', { renovacionConvenio: renovacionConvenio.id }),
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
