import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documentos/layout';
import { useEffect, useRef, useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { ExpedienteMovimientoFullType } from '@/schemas/expediente-movimiento-schema';
import { SimpleDetailList, buildDetailItems } from '@/components/ui/simple-detail-list';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Movimientos',
    href: route('documentos.movimientos.index'),
  },
];

type MovimientoRow = ExpedienteMovimientoFullType & {
  expediente_nombre?: string | null;
  dependencia_destino_abreviatura?: string | null;
  fecha_movimiento_ddmmyyyy?: string | null;
  fojas?: string | null;
  motivo?: string | null;
  observaciones?: string | null;
};

type PageProps = {
  movimientos: {
    data: MovimientoRow[];
    current_page: number;
    last_page: number;
  };
  expedientes: { value: number; label: string }[];
  dependencias: { value: number; label: string }[];
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: Record<string, string | null>;
  toast?: {
    type: 'success' | 'error';
    message: string;
  };
};

export default function MovimientosIndex() {
  const {
    movimientos,
    expedientes = [],
    dependencias = [],
    search,
    sort,
    direction,
    filters: initialFilters,
    toast: flashToast,
  } = usePage().props as unknown as PageProps;

  const columns = [
    {
      title: 'Expediente',
      accessor: 'expediente_nombre',
      sortable: false,
      width: '200px',
      align: 'center' as const,
    },
    {
      title: 'Dependencia destino',
      accessor: 'dependencia_destino_abreviatura',
      sortable: false,
      width: '220px',
      align: 'center' as const,
    },
    {
      title: 'Fojas',
      accessor: 'fojas',
      sortable: true,
      width: '140px',
      align: 'center' as const,
    },
    {
      title: 'Fecha movimiento',
      accessor: 'fecha_movimiento_ddmmyyyy',
      sortable: true,
      width: '180px',
      align: 'center' as const,
    },
  ];

  const [movimientoToShow, setMovimientoToShow] = useState<MovimientoRow | null>(null);
  const [movimientoToDelete, setMovimientoToDelete] = useState<MovimientoRow | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    expediente_id: initialFilters?.expediente_id ?? '',
    dependencia_destino_id: initialFilters?.dependencia_destino_id ?? '',
    fecha_desde: initialFilters?.fecha_desde ?? '',
    fecha_hasta: initialFilters?.fecha_hasta ?? '',
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
      expediente_id: initialFilters?.expediente_id ?? '',
      dependencia_destino_id: initialFilters?.dependencia_destino_id ?? '',
      fecha_desde: initialFilters?.fecha_desde ?? '',
      fecha_hasta: initialFilters?.fecha_hasta ?? '',
    });
  }, [initialFilters]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Movimientos" />
      <DocumentosLayout title="Movimientos" description="Listado de movimientos de expedientes">
        <div className="flex h-full flex-grow flex-col gap-4 overflow-x-auto rounded-xl p-4">
          <DataTable
            title="Listado de Movimientos"
            data={movimientos.data}
            totalItems={movimientos.data.length}
            columns={columns}
            currentPage={movimientos.current_page}
            totalPages={movimientos.last_page}
            onPageChange={(page) => {
              router.get(
                route('documentos.movimientos.index'),
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
                route('documentos.movimientos.index'),
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
                route('documentos.movimientos.index'),
                { search: value },
                {
                  preserveState: true,
                  replace: true,
                },
              );
            }}
            onNew={() => router.get(route('documentos.movimientos.create'))}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row) => ({
              view: () => setMovimientoToShow(row as MovimientoRow),
              edit: route('documentos.movimientos.edit', row.id),
              delete: () => setMovimientoToDelete(row as MovimientoRow),
            })}
          />
        </div>
      </DocumentosLayout>

      <GenericDialog
        open={!!movimientoToShow}
        onClose={() => setMovimientoToShow(null)}
        title="Detalles del movimiento"
        description="Informacion completa del movimiento seleccionado"
        footer={
          <Button
            className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
            onClick={() => movimientoToShow && router.get(route('documentos.movimientos.edit', movimientoToShow.id))}
          >
            Editar
          </Button>
        }
      >
        <SimpleDetailList
          items={buildDetailItems(movimientoToShow ?? {}, [
            { key: 'expediente_nombre', label: 'Expediente', hideIfEmpty: true },
            { key: 'dependencia_destino_abreviatura', label: 'Dependencia destino', hideIfEmpty: true },
            { key: 'fojas', label: 'Fojas', hideIfEmpty: true },
            { key: 'fecha_movimiento_ddmmyyyy', label: 'Fecha de movimiento', hideIfEmpty: true },
            { key: 'motivo', label: 'Motivo', hideIfEmpty: true },
            { key: 'observaciones', label: 'Observaciones', hideIfEmpty: true },
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
                router.get(route('documentos.movimientos.index'));
                setShowFilters(false);
              }}
            >
              Limpiar
            </Button>
            <Button
              className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
              onClick={() => {
                router.get(
                  route('documentos.movimientos.index'),
                  {
                    expediente_id: filters.expediente_id,
                    dependencia_destino_id: filters.dependencia_destino_id,
                    fecha_desde: filters.fecha_desde,
                    fecha_hasta: filters.fecha_hasta,
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
            <Label htmlFor="expediente_id">Expediente</Label>
            <ComboBox
              options={expedientes}
              value={filters.expediente_id}
              onChange={(val) => setFilters({ ...filters, expediente_id: val ?? '' })}
              placeholder="Seleccione un expediente"
            />
          </div>
          <div>
            <Label htmlFor="dependencia_destino_id">Dependencia destino</Label>
            <ComboBox
              options={dependencias}
              value={filters.dependencia_destino_id}
              onChange={(val) => setFilters({ ...filters, dependencia_destino_id: val ?? '' })}
              placeholder="Seleccione una dependencia"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="fecha_desde">Fecha desde</Label>
              <Input
                id="fecha_desde"
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fecha_hasta">Fecha hasta</Label>
              <Input
                id="fecha_hasta"
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
              />
            </div>
          </div>
        </div>
      </GenericDialog>

      <ConfirmDeleteDialog
        open={!!movimientoToDelete}
        onCancel={() => setMovimientoToDelete(null)}
        onConfirm={() => {
          if (movimientoToDelete) {
            router.delete(route('documentos.movimientos.destroy', movimientoToDelete.id));
          }
        }}
        title="Eliminar movimiento?"
        description="Estas seguro que deseas eliminar el movimiento del expediente? Esta accion no se puede deshacer."
      />
    </AppLayout>
  );
}
