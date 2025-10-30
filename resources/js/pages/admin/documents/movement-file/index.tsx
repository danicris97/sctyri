import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documents/layout';
import { useEffect, useRef, useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { FileMovement } from '@/types/file';
import { route } from 'ziggy-js';
import { Option } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Movimientos de Expedientes',
    href: route('documents.movements.index'),
  },
];

type PageProps = {
  movements: {
    data: FileMovement[];
    current_page: number;
    last_page: number;
  };
  files: Option[];
  dependencies: Option[];
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: Record<string, string | null>;
  toast?: {
    type: 'success' | 'error';
    message: string;
  };
};

export default function MovementsIndex() {
  const {
    movements,
    files = [],
    dependencies = [],
    search,
    sort,
    direction,
    filters: initialFilters,
    toast: flashToast,
  } = usePage().props as unknown as PageProps;

  const columns = [
    {
      title: 'Expediente',
      accessor: 'file_name',
      sortable: false,
      width: '200px',
      align: 'center' as const,
    },
    {
      title: 'Dependencia destino',
      accessor: 'dependency_abbreviature',
      sortable: false,
      width: '220px',
      align: 'center' as const,
    },
    {
      title: 'Fojas',
      accessor: 'folios',
      sortable: true,
      width: '140px',
      align: 'center' as const,
    },
    {
      title: 'Fecha movimiento',
      accessor: 'formated_date',
      sortable: true,
      width: '180px',
      align: 'center' as const,
    },
  ];

  const [movementToDelete, setMovementToDelete] = useState<FileMovement | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    file_id: initialFilters?.file_id ?? '',
    dependency_id: initialFilters?.dependency_id ?? '',
    date_since: initialFilters?.date_since ?? '',
    date_until: initialFilters?.date_until ?? '',
  });
  const dialogContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flashToast) {
      toast[flashToast.type](flashToast.message, {
        description: new Date().toLocaleString(),
      });
    }
  }, [flashToast]);

  useEffect(() => {
    setFilters({
      file_id: initialFilters?.file_id ?? '',
      dependency_id: initialFilters?.dependency_id ?? '',
      date_since: initialFilters?.date_since ?? '',
      date_until: initialFilters?.date_until ?? '',
    });
  }, [initialFilters]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Movimientos de Expedientes" />
      <DocumentosLayout title="Movimientos de Expedientes" description="Listado de movimientos de expedientes">
        <div className="flex h-full flex-grow flex-col gap-4 overflow-x-auto rounded-xl p-4">
          <DataTable
            title="Listado de Movimientos"
            data={movements.data}
            totalItems={movements.data.length}
            columns={columns}
            currentPage={movements.current_page}
            totalPages={movements.last_page}
            onPageChange={(page) => {
              router.get(
                route('documents.movements.index'),
                {
                  page,
                  search,
                  sort,
                  direction,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onSort={(column, dir) => {
              router.get(
                route('documents.movements.index'),
                {
                  sort: column,
                  direction: dir,
                  search,
                  page: 1,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            defaultSort={{ column: 'created_at', direction: 'desc' }}
            onSearch={(value) => {
              router.get(
                route('documents.movements.index'),
                { search: value },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onNew={() => router.get(route('documents.movements.create'))}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row) => ({
              view: () => route('documents.movements.show', row.id),
              edit: route('documents.movements.edit', row.id),
              delete: () => setMovementToDelete(row),
            })}
          />
        </div>
      </DocumentosLayout>

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
                router.get(route('documents.movements.index'));
                setShowFilters(false);
              }}
            >
              Limpiar
            </Button>
            <Button
              className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
              onClick={() => {
                router.get(
                  route('documents.movements.index'),
                  {
                    file_id: filters.file_id,
                    dependency_id: filters.dependency_id,
                    date_since: filters.date_since,
                    date_until: filters.date_until,
                  },
                  { preserveState: true },
                );
                setShowFilters(false);
              }}
            >
              Buscar
            </Button>
          </>
        }
      >
        <div className="space-y-4" ref={dialogContentRef}>
          <div>
            <Label htmlFor="file_id">Expediente</Label>
            <ComboBox
              options={files}
              value={filters.file_id}
              onChange={(val) => setFilters({ ...filters, file_id: val ?? '' })}
              placeholder="Seleccione un expediente"
            />
          </div>
          <div>
            <Label htmlFor="dependency_id">Dependencia destino</Label>
            <ComboBox
              options={dependencies}
              value={filters.dependency_id}
              onChange={(val) => setFilters({ ...filters, dependency_id: val ?? '' })}
              placeholder="Seleccione una dependencia"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="date_since">Fecha desde</Label>
              <Input
                id="date_since"
                type="date"
                value={filters.date_since}
                onChange={(e) => setFilters({ ...filters, date_since: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="date_until">Fecha hasta</Label>
              <Input
                id="date_until"
                type="date"
                value={filters.date_until}
                onChange={(e) => setFilters({ ...filters, date_until: e.target.value })}
              />
            </div>
          </div>
        </div>
      </GenericDialog>

      <ConfirmDeleteDialog
        open={!!movementToDelete}
        onCancel={() => setMovementToDelete(null)}
        onConfirm={() => {
          if (movementToDelete) {
            router.delete(route('documents.movements.destroy', movementToDelete.id));
          }
        }}
        title="Eliminar movimiento?"
        description="Estas seguro que deseas eliminar el movimiento del expediente? Esta accion no se puede deshacer."
      />
    </AppLayout>
  );
}
