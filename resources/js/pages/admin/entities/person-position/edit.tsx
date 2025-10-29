import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DropdownOption } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import PersonaRolForm from '@/components/forms/person-position-form';
import { type PersonaRolFullType } from '@/schemas/persona-rol-schema';
import { toast } from 'sonner';

export default function EditPersona() {
  const { personaRol } = usePage().props as unknown as { personaRol: PersonaRolFullType };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'PERSONAS',
      href: route('entidades.personas.index'),
    },
    {
      title: `Editar: ${personaRol.persona.nombre} ${personaRol.persona.apellido}`,
      href: route('entidades.personas.edit', personaRol.id),
    },
  ];

  const { props } = usePage<{ personas: DropdownOption[], roles: DropdownOption[], errors: any }>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Persona" />
      <EntidadesLayout title="Editar Persona" description="Edita una persona.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Persona</h1>
          <PersonaRolForm personaRol={personaRol} personas={props.personas} roles={props.roles} errors={props.errors} onSubmit={(data) => {
            router.put(route('entidades.personas.update', personaRol.id), data, {
              onError: (errors) => {
                toast.error("Error al actualizar la persona", {
                  description: "Revisá los campos del formulario.",
                })
              },
              onSuccess: () => {
                router.visit(route('entidades.personas.index'))
              },
            })
          }}/>
        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
