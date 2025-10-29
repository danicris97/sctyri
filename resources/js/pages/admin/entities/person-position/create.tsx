import EntitiesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Option } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import PersonaRolForm from '@/components/forms/person-position-form';
import { toast } from 'sonner';

export default function CreatePersona() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'PERSONAS',
      href: route('entities.person-position.index'),
    },
    {
      title: 'Nueva Persona',
      href: route('entities.person-position.create'),
    },
  ];

  const { props } = usePage<{ 
    persons: Option[], 
    positions: Option[], 
    errors: any 
  }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Persona" />
      <EntitiesLayout title="Nueva Persona" description="Crea una nueva persona.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Persona</h1>
          <PersonaRolForm
            persons={props.persons}
            positions={props.positions}
            errors={props.errors}
            onSubmit={(data) => {
              router.post(route('entidades.person-position.store'), data, {
                onError: (errors) => {
                  toast.error("Error al crear la persona", {
                    description: "Revisá los campos del formulario.",
                  })
                },
                onSuccess: () => {
                  router.visit(route('entidades.person-position.index'))
                },
              })
            }}
          />
        </div>
      </EntitiesLayout>
    </AppLayout>
  );
}