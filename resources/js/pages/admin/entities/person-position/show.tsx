import EntidadesLayout from '@/layouts/admin/entities/layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PersonPosition } from '@/types/person';
import { route } from 'ziggy-js';

export default function ShowPerson() {
  const { personPosition } = usePage().props as unknown as { personPosition: PersonPosition };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'PERSONAS',
      href: route('entidades.person-position.index'),
    },
    {
      title: `Ver: ${personPosition.person.name} ${personPosition.person.surname}`,
      href: route('entidades.person-position.show', personPosition.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ver Persona" />
      <EntidadesLayout title="Ver Persona" description="Ver una persona.">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Ver Persona</h1>

        </div>
      </EntidadesLayout>
    </AppLayout>
  );
}
