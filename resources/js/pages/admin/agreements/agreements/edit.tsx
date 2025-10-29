import ConveniosLayout from '@/layouts/admin/convenios/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ConvenioForm from '@/components/forms/convenio/convenio-form';
import { type ConvenioFullType } from '@/schemas/convenio-schema';
import { DropdownOption } from '@/types';

export default function EditConvenio() {
  const { props } = usePage<{
    convenios_tipos: DropdownOption[]
    resoluciones_tipos: DropdownOption[]
    instituciones: DropdownOption[]
    instituciones_tipos: DropdownOption[]
    unidades_academicas: DropdownOption[]
    unidades_academicas_tipos: DropdownOption[]
    firmantes_unsa: DropdownOption[]
    expedientes: DropdownOption[]
    expedientes_tipos: DropdownOption[]
    personas: DropdownOption[]
    roles: DropdownOption[]
    renovaciones_convenios_tipos: DropdownOption[]
    convenio?: ConvenioFullType
  }>();

  const { convenio } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CONVENIOS',
      href: route("convenios.convenios.index"),
    },
    {
      title: `Editar: ${convenio?.nombre}`,
      href: route('convenios.convenios.edit', convenio?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Convenio" />
      <ConveniosLayout title="Editar Convenio" description="Edita un convenio existente.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Convenio</h1>
          <ConvenioForm 
            { ...props }
            showResolucionSection={false}
          />
        </div>
      </ConveniosLayout>
    </AppLayout>
  );
}
