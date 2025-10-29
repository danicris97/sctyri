import { BreadcrumbItem } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar, Globe, Landmark } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { type RenovacionConvenioType } from '@/schemas/renovacion-convenio-schema';
import AppLayout from '@/layouts/app-layout';
import ConveniosLayout from '@/layouts/admin/agreements/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { ComboBox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import 'dayjs/locale/es';
import { route } from "ziggy-js";
import { SimpleDetailList, buildDetailItems } from '@/components/ui/simple-detail-list';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Renovaciones de Convenios',
        href: route('convenios.renovaciones.index'),
    },
];

// Estadísticas de ejemplo

export default function RenovacionesConveniosIndex() {
    const { renovaciones_convenios, search, sort, direction, toast: flashToast, tipos = [], convenios = [], expedientes = [], instituciones = [], dependencias = [], stats } = usePage().props as unknown as {
      renovaciones_convenios: {
        data: RenovacionConvenioType[];
        current_page: number;
        last_page: number;
      };
      search?: string;
      sort?: string;
      direction?: 'asc' | 'desc';
      toast?: {
        type: 'success' | 'error';
        message: string;
      };
      tipos: { value: string; label: string }[];
      convenios: { value: string; label: string }[];
      expedientes: { value: string; label: string }[];
      instituciones: { value: string; label: string }[];
      dependencias: { value: string; label: string }[];
      stats: {
        ultimas_renovaciones: 0;
        total_renovaciones: 0;
        total_instituciones: 0;
        total_internacionales: 0;
        ultima_fecha: string | null;
      };
    };

    const columns = [
      {
        title: "Convenio",
        accessor: "convenio_nombre",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Fecha de Inicio",
        accessor: "fecha_inicio_texto",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Duración",
        accessor: "duracion",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Fecha de Fin",
        accessor: "fecha_fin_texto",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const statsList = [
        {
          title: "Ultimas renovaciones",
          value: stats.ultimas_renovaciones.toString(),
          description: "Renovaciones de convenios en los ultimos 30 días",
          icon: FileText,
          trend: (stats.total_renovaciones > 0 ? `${Math.round((stats.ultimas_renovaciones * 100) / stats.total_renovaciones)}% del total` : "0% del total"),
        },
        {
          title: "Total de Renovaciones",
          value: stats.total_renovaciones.toString(),
          description: "Renovaciones de convenios registradas en el sistema",
          icon: Calendar,
          trend: (stats.total_renovaciones > 0 ? `${Math.round((stats.total_renovaciones * 100) / stats.total_renovaciones)}% del total` : "0% del total"),
        },
        /*{
          title: "Total de Instituciones",
          value: stats.total_instituciones.toString(),
          description: "Instituciones registradas en el sistema",
          icon: Landmark,
          trend: stats.ultima_fecha ? `Último registro: ${new Intl.DateTimeFormat("es-AR", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(stats.ultima_fecha))}`
            : "Sin registros",
        },
        {
          title: "Instituciones Internacionales",
          value: stats.total_internacionales.toString(),
          description: "Instituciones con convenios internacionales",
          icon: Globe,
          trend: (stats.total_instituciones > 0 ? `${Math.round((stats.total_internacionales * 100) / stats.total_instituciones)}% del total` : "0% del total"),
        },*/
    ]

    const [renovacionConvenioToShow, setRenovacionConvenioToShow] = useState<RenovacionConvenioType | null>(null);
    const [renovacionConvenioToDelete, setRenovacionConvenioToDelete] = useState<RenovacionConvenioType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      fecha_desde: '',
      fecha_hasta: '',
      tipo_renovacion: '',
      convenio_id: '',
      expediente_id: '',
      institucion_id: '',
      dependencia_unsa_id: '',
    });

    useEffect(() => {
      if (flashToast) {
        toast[flashToast.type](flashToast.message, {
          description: new Date().toLocaleString(),
        });
      }
    }, [flashToast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Renovaciones de Convenios"/>
            <ConveniosLayout title='Renovaciones de Convenios' description='Listado de renovaciones de convenios'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsList.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Renovaciones de Convenios"
                    data={renovaciones_convenios.data}
                    totalItems={renovaciones_convenios.data.length}
                    columns={columns}
                    currentPage={renovaciones_convenios.current_page}
                    totalPages={renovaciones_convenios.last_page}
                    onPageChange={(page) => {
                      router.get(route('convenios.renovaciones.index'), {
                        page,
                        search: search, // este lo traés de props
                        sort,
                        direction,
                        ...filters,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}

                    onSort={(column, direction) => {
                      router.get(route('convenios.renovaciones.index'), {
                        sort: column,
                        direction,
                        search: search, // también lo pasás
                        page: 1,
                        ...filters,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    defaultSort={{ column: 'created_at', direction: 'desc' }}
                    onSearch={(value) => {
                      router.get(route('convenios.renovaciones.index'), { search: value, ...filters }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('convenios.renovaciones.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => setRenovacionConvenioToShow(row),
                      edit: route('convenios.renovaciones.edit', { renovacionConvenio: row.id }),
                      delete: () => setRenovacionConvenioToDelete(row),
                    })}
                  />
                </div>
            </ConveniosLayout>

            <GenericDialog
              open={!!renovacionConvenioToShow}
              onClose={() => setRenovacionConvenioToShow(null)}
              title="Detalles de la renovacion de convenio"
              description="Informacion completa de la renovacion de convenio seleccionada"
              footer={
                <Button
                  className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                  onClick={() => {
                    if (!renovacionConvenioToShow) return;
                    router.get(route('convenios.renovaciones.edit', { renovacionConvenio: renovacionConvenioToShow.id }));
                  }}
                >
                  Editar
                </Button>
              }
            >
              <SimpleDetailList
                items={buildDetailItems(renovacionConvenioToShow ?? {}, [
                  {
                    key: 'convenio_nombre',
                    label: 'Convenio',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.convenio_nombre ?? '',
                  },
                  {
                    key: 'fecha_inicio',
                    label: 'Fecha de Inicio',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.fecha_inicio_texto ?? '',
                  },
                  {
                    key: 'fecha_fin',
                    label: 'Fecha de Fin',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.fecha_fin_texto ?? '',
                  },
                  {
                    key: 'duracion',
                    label: 'Duracion',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.duracion ?? '',
                  },
                  {
                    key: 'observaciones',
                    label: 'Observaciones',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.observaciones ?? '',
                  },
                  {
                    key: 'tipo_renovacion',
                    label: 'Tipo de Renovacion',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.convenio.tipo_renovacion ?? '',
                  },
                  {
                    key: 'resolucion_texto',
                    label: 'Resolución',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.resolucion_texto ?? '',
                  },
                  {
                    key: 'expediente_texto',
                    label: 'Expediente',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.expediente_texto ?? '',
                  },
                  {
                    key: 'link',
                    isLink: true,
                    label: 'Link',
                    hideIfEmpty: true,
                    transform: () => renovacionConvenioToShow?.resolucion?.link ?? '',
                    hrefTransform: (v) => (v ? String(v) : undefined),
                  }
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
                      // Limpia los filtros reiniciando la página sin query params
                      router.get(route('convenios.renovaciones.index'), { ...filters }, { preserveState: true });
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('convenios.renovaciones.index'), {
                        fecha_desde: filters.fecha_desde,
                        fecha_hasta: filters.fecha_hasta,
                        tipo_renovacion: filters.tipo_renovacion,
                        convenio_id: filters.convenio_id,
                        expediente_id: filters.expediente_id,
                        institucion_id: filters.institucion_id,
                        dependencia_unsa_id: filters.dependencia_unsa_id,
                      }, { preserveState: true });
                      setShowFilters(false);
                    }}
                  >
                    Buscar
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
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
                <div>
                  <Label htmlFor="tipo_renovacion">Tipo de renovación</Label>
                  <ComboBox
                    options={tipos}
                    value={filters.tipo_renovacion}
                    onChange={(val) => setFilters({ ...filters, tipo_renovacion: val ?? '' })}
                    placeholder="Seleccione un tipo"
                  />
                </div>
                <div>
                  <Label htmlFor="convenio_id">Convenio</Label>
                  <ComboBox
                    options={convenios}
                    value={filters.convenio_id}
                    onChange={(val) => setFilters({ ...filters, convenio_id: val ?? '' })}
                    placeholder="Seleccione un convenio"
                  />
                </div>
                <div>
                  <Label htmlFor="expediente_id">Expediente</Label>
                  <ComboBox
                    options={expedientes.map((e) => ({
                      ...e,
                      value: String(e.value),
                    }))}
                    value={filters.expediente_id ? String(filters.expediente_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, expediente_id: val ?? '' })
                    }}
                    placeholder="Seleccione un expediente"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="institucion_id">Institución</Label>
                  <ComboBox
                    options={instituciones.map((inst) => ({
                      ...inst,
                      value: String(inst.value),
                    }))}
                    value={filters.institucion_id ? String(filters.institucion_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, institucion_id: val ?? '' })
                    }}
                    placeholder="Seleccione una institución"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="dependencia_unsa_id">Unidad Académica</Label>
                  <ComboBox
                    options={dependencias.map((d) => ({
                      ...d,
                      value: String(d.value),
                    }))}
                    value={filters.dependencia_unsa_id ? String(filters.dependencia_unsa_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, dependencia_unsa_id: val ?? '' })
                    }}
                    placeholder="Seleccione una unidad académica"
                    className="w-full"
                  />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!renovacionConvenioToDelete}
              onCancel={() => {
                setRenovacionConvenioToDelete(null);
              }}
              onConfirm={() => {
                if (renovacionConvenioToDelete) {
                  const id = renovacionConvenioToDelete.id;
                  router.delete(route('convenios.renovaciones.destroy', id));
                }
              }}
              title="¿Eliminar renovacion de convenio?"
              description={`¿Estás seguro que deseas eliminar la renovacion de convenio ${renovacionConvenioToDelete?.convenio_nombre + ' ' + renovacionConvenioToDelete?.fecha_inicio_texto || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
