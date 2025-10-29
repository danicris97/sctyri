import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import BajaConvenioForm from '@/components/forms/baja-convenio-form';
import { type BajaConvenioType } from '@/schemas/baja-convenio-schema';

export default function EditBajaConvenio() {
  const { props } = usePage<{ 
    convenios: DropdownOption[], 
    resoluciones: DropdownOption[], 
    convenio_nombre: string,
    resoluciones_tipos: { value: string; label: string }[],
    expedientes: { value: string; label: string }[],
    baja_convenio?: BajaConvenioType
  }>()

  const { baja_convenio, convenio_nombre } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'BAJAS DE CONVENIOS',
      href: route('convenios.bajas.index'),
    },
    {
      title: `Editar: ${convenio_nombre}`,
      href: route('convenios.bajas.edit', baja_convenio?.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Baja de Convenio" />
      <ConveniosLayout title="Editar Baja de Convenio" description="Edita una baja de convenio existente para los convenios.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Baja de Convenio</h1>
          <BajaConvenioForm
            {...props}
            hideConvenioSelector
          />
        </div>
      </ConveniosLayout>
    </AppLayout>
  );
}
