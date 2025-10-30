import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EntitiesLayout from '@/layouts/admin/entities/layout';
import { BreadcrumbItem, Option, FlashToast } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { PersonPosition } from '@/types/person';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { ComboBox } from '@/components/ui/combobox';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Personas',
    href: route('entities.person-position.index'),
  },
];

type PersonsIndexProps = {
  personPositions: {
    data: PersonPosition[];
    current_page: number;
    last_page: number;
    total: number;
  };
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: {
    position?: string | null;
  } | null;
  toast?: FlashToast;
  positions: Option[];
};

export default function PersonsIndex() {
  const {
    personPositions,
    search,
    sort,
    direction,
    filters: initialFilters,
    toast: flashToast,
    positions,
  } = usePage().props as unknown as PersonsIndexProps;

  const [personToDelete, setPersonToDelete] = useState<PersonPosition | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    position: initialFilters?.position ?? '',
  });

  useEffect(() => {
    setFilters({
      position: initialFilters?.position ?? '',
    });
  }, [initialFilters?.position]);

  useEffect(() => {
    if (!flashToast) return;
    toast[flashToast.type](flashToast.message, {
      description: new Date().toLocaleString(),
    });
  }, [flashToast]);

  const columns = [
    {
      title: 'Nombre',
      accessor: 'name',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonPosition) => row.person.name,
    },
    {
      title: 'Apellido',
      accessor: 'surname',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonPosition) => row.person.surname,
    },
    {
      title: 'DNI',
      accessor: 'dni',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (row: PersonPosition) => row.person.dni ?? '',
    },
    {
      title: 'Cargo',
      accessor: 'position',
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
      <EntitiesLayout
        title="Personas"
        description="Personas registradas en el sistema"
      >
        <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
          <DataTable
            title="Listado de Personas"
            data={personPositions.data}
            totalItems={personPositions.total}
            columns={columns}
            currentPage={personPositions.current_page}
            totalPages={personPositions.last_page}
            onPageChange={(page) => {
              router.get(
                route('entidades.persons-positions.index'),
                {
                  page,
                  search,
                  sort,
                  direction,
                  position: filters.position || undefined,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onSort={(column, nextDirection) => {
              router.get(
                route('entidades.persons-positions.index'),
                {
                  search,
                  sort: column,
                  direction: nextDirection,
                  position: filters.position || undefined,
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
                route('entidades.persons-positions.index'),
                {
                  search: value,
                  sort,
                  direction,
                  position: filters.position || undefined,
                  page: 1,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row: PersonPosition) => ({
              view: route('entidades.persons-positions.show', row.id),
              edit: route('entidades.persons-positions.edit', row.id),
              delete: () => setPersonToDelete(row),
            })}
          />
        </div>
      </EntitiesLayout>

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
                setFilters({ position: '' });
                router.get(route('entidades.persons-positions.index'));
                setShowFilters(false);
              }}
            >
              Limpiar
            </Button>

            <Button
              className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
              onClick={() => {
                router.get(
                  route('entidades.persons-positions.index'),
                  {
                    search,
                    sort,
                    direction,
                    position: filters.position || undefined,
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
            <Label htmlFor="tipo">Cargo</Label>
            <ComboBox
              options={positions}
              value={filters.position}
              onChange={(val) => setFilters({ ...filters, position: val ?? '' })}
              placeholder="Seleccione un cargo"
            />
          </div>
        </div>
      </GenericDialog>

      <ConfirmDeleteDialog
        open={!!personToDelete}
        onCancel={() => setPersonToDelete(null)}
        onConfirm={() => {
          if (!personToDelete) return;
          router.delete(route('entidades.persons-positions.destroy', personToDelete.id));
          setPersonToDelete(null);
        }}
        title="Eliminar persona?"
        description={`Estas seguro que deseas eliminar a ${personToDelete?.person.surname ?? ''} ${personToDelete?.person.name ?? ''}? Esta accion no se puede deshacer.`}
      />
    </AppLayout>
  );
}
