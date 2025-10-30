import ConveniosLayout from '@/layouts/admin/agreements/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DropdownOption } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import BajaConvenioForm from '@/components/forms/agreement-cancellation-form';

export default function CreateBajaConvenios() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'BAJAS DE CONVENIOS',
      href: route('convenios.bajas.index'),
    },
    {
      title: 'Nueva Baja de Convenio',
      href: route('convenios.bajas.create'),
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
      <Head title="Nueva Baja de Convenio" />
      <ConveniosLayout title="Nueva Baja de Convenio" description="Crea una nueva baja de convenio para los convenios.">
        {/* Aquí iría el formulario para crear una nueva institución */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Baja de Convenio</h1>
          {/* Formulario de creación de baja de convenio */}
          <BajaConvenioForm
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
