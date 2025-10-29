import EntidadesLayout from '@/layouts/admin/entidades/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Option } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import PersonaRolForm from '@/components/forms/persona-rol-form';
import { toast } from 'sonner';

export default function CreatePersona() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'PERSONAS',
      href: route('entidades.personas.index'),
    },
    {
      title: 'Nueva Persona',
      href: route('entidades.personas.create'),
    },
  ];

  const { props } = usePage<{ personas: DropdownOption[], roles: DropdownOption[], errors: any }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Persona" />
      <EntidadesLayout title="Nueva Persona" description="Crea una nueva persona.">
        {/* Aquí iría el formulario para crear un nuevo firmante UNSa */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nueva Persona</h1>
          {/* Formulario de creación de firmante UNSa */}
          <PersonaRolForm
            personas={props.personas}
            roles={props.roles}
            errors={props.errors}
            onSubmit={(data) => {
              router.post(route('entidades.personas.store'), data, {
                onError: (errors) => {
                  toast.error("Error al crear la persona", {
                    description: "Revisá los campos del formulario.",
                  })
                },
                onSuccess: () => {
                  router.visit(route('entidades.personas.index'))
                },
              })
            }}
          />
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}