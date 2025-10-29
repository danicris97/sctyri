import { BreadcrumbItem } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar, Globe, Landmark } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { type BajaConvenioType } from '@/schemas/baja-convenio-schema';
import AppLayout from '@/layouts/app-layout';
import ConveniosLayout from '@/layouts/admin/agreements/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import 'dayjs/locale/es';
import { route } from "ziggy-js";
import { SimpleDetailList, buildDetailItems } from '@/components/ui/simple-detail-list';
import { ComboBox } from '@/components/ui/combobox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Baja de Convenios',
        href: route('convenios.bajas.index'),
    },
];

// Estadísticas de ejemplo

export default function BajasConveniosIndex() {
    const { bajasConvenio, search, sort, direction, toast: flashToast, stats, convenios, resoluciones, expedientes, instituciones, dependencias } = usePage().props as unknown as {
      bajasConvenio: {
        data: BajaConvenioType[];
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
      stats: {
        ultimas_bajas: 0;
        total_bajas: 0;
        total_instituciones: 0;
        total_internacionales: 0;
        ultima_fecha: string | null;
      };
      convenios: { value: string; label: string }[];
      resoluciones: { value: string; label: string }[];
      expedientes: { value: string; label: string }[];
      instituciones: { value: string; label: string }[];
      dependencias: { value: string; label: string }[];
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
        title: "Fecha de Baja",
        accessor: "fecha_baja_texto",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Motivo",
        accessor: "motivo",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const statsList = [
        {
          title: "Ultimas bajas",
          value: stats.ultimas_bajas.toString(),
          description: "Bajas de convenios en los ultimos 30 días",
          icon: FileText,
          trend: (stats.total_bajas > 0 ? `${Math.round((stats.ultimas_bajas * 100) / stats.total_bajas)}% del total` : "0% del total"),
        },
        {
          title: "Total de Bajas",
          value: stats.total_bajas.toString(),
          description: "Bajas de convenios registradas en el sistema",
          icon: Calendar,
          trend: (stats.total_bajas > 0 ? `${Math.round((stats.total_bajas * 100) / stats.total_bajas)}% del total` : "0% del total"),
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

    const [bajaConvenioToShow, setBajaConvenioToShow] = useState<BajaConvenioType | null>(null);
    const [bajaConvenioToDelete, setBajaConvenioToDelete] = useState<BajaConvenioType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      fecha_desde: '',
      fecha_hasta: '',
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
            <Head title="Bajas de Convenios"/>
            <ConveniosLayout title='Bajas de Convenios' description='Listado de bajas de convenios registradas en el sistema'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsList.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Bajas de Convenios"
                    data={bajasConvenio.data}
                    totalItems={bajasConvenio.data.length}
                    columns={columns}
                    currentPage={bajasConvenio.current_page}
                    totalPages={bajasConvenio.last_page}
                    onPageChange={(page) => {
                      router.get(route('convenios.bajas.index'), {
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
                      router.get(route('convenios.bajas.index'), {
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
                      router.get(route('convenios.bajas.index'), { search: value, ...filters }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('convenios.bajas.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => setBajaConvenioToShow(row),
                      edit: route('convenios.bajas.edit', row.id),
                      delete: () => setBajaConvenioToDelete(row),
                    })}
                  />
                </div>
            </ConveniosLayout>

            <GenericDialog
              open={!!bajaConvenioToShow}
              onClose={() => setBajaConvenioToShow(null)}
              title="Detalles de la baja de convenio"
              description="Informacion completa de la baja de convenio seleccionada"
              footer={
                <Button
                  className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                  onClick={() => {
                    if (!bajaConvenioToShow) return;
                    router.get(route('convenios.bajas.edit', bajaConvenioToShow.id));
                  }}
                >
                  Editar
                </Button>
              }
            >
              <SimpleDetailList
                items={buildDetailItems(bajaConvenioToShow ?? {}, [
                  {
                    key: 'convenio_nombre',
                    label: 'Convenio',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.convenio_nombre ?? '',
                  },
                  {
                    key: 'fecha_baja',
                    label: 'Fecha de Baja',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.fecha_baja_texto ?? '',
                  },
                  {
                    key: 'motivo',
                    label: 'Motivo',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.motivo ?? '',
                  },
                  {
                    key: 'resolucion_texto',
                    label: 'Resolución',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.resolucion_texto ?? '',
                  },
                  {
                    key: 'expediente_texto',
                    label: 'Expediente',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.expediente_texto ?? '',
                  },
                  {
                    key: 'link',
                    isLink: true,
                    label: 'Link',
                    hideIfEmpty: true,
                    transform: () => bajaConvenioToShow?.resolucion.link ?? '',
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
                      router.get(route('convenios.bajas.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('convenios.bajas.index'), {
                        fecha_desde: filters.fecha_desde,
                        fecha_hasta: filters.fecha_hasta,
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
                  <Label htmlFor="fecha_baja">Fecha de Baja</Label>
                  <Input
                    id="fecha_baja"
                    type="date"
                    value={filters.fecha_desde}
                    onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_baja">Fecha de Baja</Label>
                  <Input
                    id="fecha_baja"
                    type="date"
                    value={filters.fecha_desde}
                    onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="convenio_id">Convenio</Label>
                  <ComboBox
                    options={convenios.map((c) => ({
                      ...c,
                      value: String(c.value),
                    }))}
                    value={filters.convenio_id ? String(filters.convenio_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, convenio_id: val ?? '' })
                    }}
                    placeholder="Seleccione un convenio"
                    className="w-full"
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
              open={!!bajaConvenioToDelete}
              onCancel={() => {
                setBajaConvenioToDelete(null);
              }}
              onConfirm={() => {
                if (bajaConvenioToDelete) {
                  const id = bajaConvenioToDelete.id;
                  router.delete(route('convenios.bajas.destroy', id));
                }
              }}
              title="¿Eliminar baja de convenio?"
              description={`¿Estás seguro que deseas eliminar la baja de convenio ${bajaConvenioToDelete?.fecha_baja || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
