import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EntidadesLayout from '@/layouts/admin/entidades/layout';
import { BreadcrumbItem, DropdownOption } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import type { PersonaRolFullType } from '@/schemas/persona-rol-schema';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SimpleDetailList, buildDetailItems } from '@/components/ui/simple-detail-list';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { ComboBox } from '@/components/ui/combobox';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Personas',
    href: route('entidades.personas.index'),
  },
];

type FlashToast = {
  type: 'success' | 'error';
  message: string;
};

type PersonasIndexProps = {
  personas: {
    data: PersonaRolFullType[];
    current_page: number;
    last_page: number;
    total: number;
  };
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: {
    rol?: string | null;
  } | null;
  toast?: FlashToast;
  roles: DropdownOption[];
};

export default function PersonasIndex() {
  const {
    personas,
    search,
    sort,
    direction,
    filters: initialFilters,
    toast: flashToast,
    roles,
  } = usePage().props as unknown as PersonasIndexProps;

  const [personaToShow, setPersonaToShow] = useState<PersonaRolFullType | null>(null);
  const [personaToDelete, setPersonaToDelete] = useState<PersonaRolFullType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rol: initialFilters?.rol ?? '',
  });

  useEffect(() => {
    setFilters({
      rol: initialFilters?.rol ?? '',
    });
  }, [initialFilters?.rol]);

  useEffect(() => {
    if (!flashToast) return;
    toast[flashToast.type](flashToast.message, {
      description: new Date().toLocaleString(),
    });
  }, [flashToast]);

  const columns = [
    {
      title: 'Nombre',
      accessor: 'nombre',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonaRolFullType) => row.persona.nombre,
    },
    {
      title: 'Apellido',
      accessor: 'apellido',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonaRolFullType) => row.persona.apellido,
    },
    {
      title: 'DNI',
      accessor: 'dni',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonaRolFullType) => row.persona.dni ?? '',
    },
    {
      title: 'Rol',
      accessor: 'rol',
      sortable: true,
      width: '180px',
      align: 'center' as const,
    },
  ];

  const defaultSort =
    sort && direction
      ? ({ column: sort, direction } as const)
      : ({ column: 'created_at', direction: 'desc' as const });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Personas" />
      <EntidadesLayout
        title="Personas"
        description="Personas que firmaron convenios institucionales por el lado de la universidad"
      >
        <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
          <DataTable
            title="Listado de Personas"
            data={personas.data}
            totalItems={personas.total}
            columns={columns}
            currentPage={personas.current_page}
            totalPages={personas.last_page}
            onPageChange={(page) => {
              router.get(
                route('entidades.personas.index'),
                {
                  page,
                  search,
                  sort,
                  direction,
                  rol: filters.rol || undefined,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onSort={(column, nextDirection) => {
              router.get(
                route('entidades.personas.index'),
                {
                  search,
                  sort: column,
                  direction: nextDirection,
                  rol: filters.rol || undefined,
                  page: 1,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            defaultSort={defaultSort}
            onSearch={(value) => {
              router.get(
                route('entidades.personas.index'),
                {
                  search: value,
                  sort,
                  direction,
                  rol: filters.rol || undefined,
                  page: 1,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row: PersonaRolFullType) => ({
              view: () => setPersonaToShow(row),
              edit: route('entidades.personas.edit', row.id),
              delete: () => setPersonaToDelete(row),
            })}
          />
        </div>
      </EntidadesLayout>

      <GenericDialog
        open={!!personaToShow}
        onClose={() => setPersonaToShow(null)}
        title="Detalles de la persona"
        description="Informacion completa de la persona seleccionada"
        footer={
          <Button
            className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
            onClick={() => {
              if (!personaToShow) return;
              router.get(route('entidades.personas.edit', personaToShow.id));
            }}
          >
            Editar
          </Button>
        }
      >
        <SimpleDetailList
          items={buildDetailItems(personaToShow ?? {}, [
            {
              key: 'persona.nombre',
              label: 'Nombre',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.nombre ?? '',
            },
            {
              key: 'persona.apellido',
              label: 'Apellido',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.apellido ?? '',
            },
            {
              key: 'persona.dni',
              label: 'DNI',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.dni ?? '',
            },
            {
              key: 'rol',
              label: 'Rol',
              hideIfEmpty: true,
            },
            {
              key: 'persona.email',
              label: 'Email',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.email ?? '',
            },
            {
              key: 'persona.telefono',
              label: 'Telefono',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.telefono ?? '',
            },
            {
              key: 'persona.domicilio',
              label: 'Domicilio',
              hideIfEmpty: true,
              transform: () => personaToShow?.persona.domicilio ?? '',
            },
            {
              key: 'activo',
              label: 'Activo',
              isBoolean: true,
              trueText: 'Si',
              falseText: 'No',
            },
          ])}
        />
      </GenericDialog>

      <GenericDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        description="Filtrar resultados de la tabla"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ rol: '' });
                router.get(route('entidades.personas.index'));
                setShowFilters(false);
              }}
            >
              Limpiar
            </Button>

            <Button
              className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
              onClick={() => {
                router.get(
                  route('entidades.personas.index'),
                  {
                    search,
                    sort,
                    direction,
                    rol: filters.rol || undefined,
                    page: 1,
                  },
                  { preserveState: true },
                );
                setShowFilters(false);
              }}
            >
              Aplicar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <ComboBox
              options={roles}
              value={filters.rol}
              onChange={(val) => setFilters({ ...filters, rol: val ?? '' })}
              placeholder="Seleccione un tipo"
            />
          </div>
        </div>
      </GenericDialog>

      <ConfirmDeleteDialog
        open={!!personaToDelete}
        onCancel={() => setPersonaToDelete(null)}
        onConfirm={() => {
          if (!personaToDelete) return;
          router.delete(route('entidades.personas.destroy', personaToDelete.id));
          setPersonaToDelete(null);
        }}
        title="Eliminar persona?"
        description={`Estas seguro que deseas eliminar a ${personaToDelete?.persona.apellido ?? ''} ${personaToDelete?.persona.nombre ?? ''}? Esta accion no se puede deshacer.`}
      />
    </AppLayout>
  );
}
