import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import PersonPositionForm from '@/components/forms/person-position-form';
import { Option } from '@/types';
import { PersonPosition } from '@/types/person';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

export default function EditPerson() {
  const { personPosition } = usePage().props as unknown as { personPosition: PersonPosition };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'PERSONAS',
      href: route('entidades.person-position.index'),
    },
    {
      title: `Editar: ${personPosition.person.name} ${personPosition.person.surname}`,
      href: route('entidades.person-position.edit', personPosition.id),
    },
  ];

  const { props } = usePage<{ persons: Option[], positions: Option[], errors: any }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Persona" />
      <EntidadesLayout title="Editar Persona" description="Edita una persona.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Persona</h1>
          <PersonPositionForm 
            personPosition={personPosition} 
            persons={props.persons} 
            positions={props.positions} 
            errors={props.errors} 
            onSubmit={(data) => {
              router.put(route('entidades.person-position.update', personPosition.id), data, {
                onError: (errors) => {
                  toast.error("Error al actualizar la persona", {
                    description: "Revisá los campos del formulario.",
                  })
                },
              })
          }}/>
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
