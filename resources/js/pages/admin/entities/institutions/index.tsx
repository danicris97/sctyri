import { BreadcrumbItem, DropdownOption } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar, Globe, Landmark } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { type InstitucionType } from '@/schemas/institucion-schema';
import AppLayout from '@/layouts/app-layout';
import EntidadesLayout from '@/layouts/admin/entities/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { ComboBox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SimpleDetailList, buildDetailItems } from "@/components/ui/simple-detail-list";
import 'dayjs/locale/es';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instituciones',
        href: route('entidades.instituciones.index'),
    },
];

type InstitucionesIndexProps = {
  instituciones: {
    data: InstitucionType[];
    current_page: number;
    last_page: number;
  };
  search?: string;
  filter?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  toast?: {
    type: 'success' | 'error';
      message: string;
  };
  tipos: DropdownOption[];
  paises: DropdownOption[];
  provincias: DropdownOption[];
  localidades: DropdownOption[];
  stats: {
    ultimas_instituciones: 0;
    total_activos: 0;
    total_instituciones: 0;
    total_internacionales: 0;
    ultima_fecha: string | null;
  };
}

export default function InstitucionesIndex() {
    const {
      instituciones, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      tipos,
      paises,
      provincias,
      localidades,
      stats 
    } = usePage().props as unknown as InstitucionesIndexProps;

    const columns = [
      {
        title: "Nombre",
        accessor: "nombre",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Tipo",
        accessor: "tipo",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "CUIT",
        accessor: "cuit",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Email",
        accessor: "email",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const statsList = [
        {
          title: "Ultimas instituciones",
          value: stats.ultimas_instituciones.toString(),
          description: "Instituciones con las que se convenió en los ultimos 30 días",
          icon: FileText,
          trend: (stats.total_instituciones > 0 ? `${Math.round((stats.ultimas_instituciones * 100) / stats.total_instituciones)}% del total` : "0% del total"),
        },
        {
          title: "Instituciones con Convenio Activo",
          value: stats.total_activos.toString(),
          description: "Actualmente activas",
          icon: Calendar,
          trend: (stats.total_instituciones > 0 ? `${Math.round((stats.total_activos * 100) / stats.total_instituciones)}% del total` : "0% del total"),
        },
        {
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
        },
    ]

    const [institucionToShow, setInstitucionToShow] = useState<InstitucionType | null>(null);
    const [institucionToDelete, setInstitucionToDelete] = useState<InstitucionType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      nombre: '',
      tipo: '',
      pais: '',
      provincia: '',
      localidad: '',
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
            <Head title="Instituciones"/>
            <EntidadesLayout title='Instituciones' description='Listado de instituciones participantes de los convenios'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsList.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Instituciones"
                    data={instituciones.data}
                    totalItems={instituciones.data.length}
                    columns={columns}
                    currentPage={instituciones.current_page}
                    totalPages={instituciones.last_page}
                    onPageChange={(page) => {
                      router.get(route('entidades.instituciones.index'), {
                        page,
                        search: search, // este lo traés de props
                        sort,
                        direction,
                        nombre: filters.nombre,
                        tipo: filters.tipo,
                        pais: filters.pais,
                        provincia: filters.provincia,
                        localidad: filters.localidad,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}

                    onSort={(column, direction) => {
                      router.get(route('entidades.instituciones.index'), {
                        sort: column,
                        direction,
                        search: search, // también lo pasás
                        page: 1,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    defaultSort={{ column: 'created_at', direction: 'desc' }}
                    onSearch={(value) => {
                      router.get(route('entidades.instituciones.index'), { search: value }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('entidades.instituciones.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => setInstitucionToShow(row),
                      edit: route('entidades.instituciones.edit', row.id),
                      delete: () => setInstitucionToDelete(row),
                    })}
                  />
                </div>
            </EntidadesLayout>

            <GenericDialog
              open={!!institucionToShow}
              onClose={() => setInstitucionToShow(null)}
              title="Detalles de la institución"
              description="Información completa de la institución seleccionada"
              footer={
                <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" onClick={() => router.get(route('entidades.instituciones.edit', institucionToShow?.id))}>
                  Editar
                </Button>
              }
            >
              <SimpleDetailList
                items={buildDetailItems(institucionToShow ?? {}, [
                  { key: "nombre", label: "Nombre", hideIfEmpty: true },
                  { key: "tipo", label: "Tipo", hideIfEmpty: true },
                  { key: "abreviatura", label: "Abreviatura", hideIfEmpty: true },
                  { key: "localidad", label: "Localidad", hideIfEmpty: true },
                  { key: "provincia", label: "Provincia", hideIfEmpty: true },
                  { key: "pais", label: "Pais", hideIfEmpty: true },
                  { key: "domicilio", label: "Domicilio", hideIfEmpty: true },
                  { key: "cuit", label: "CUIT", hideIfEmpty: true },
                  { key: "telefono", label: "Teléfono", hideIfEmpty: true },
                  { key: "email", label: "Email", hideIfEmpty: true },
                  { key: "web", label: "Sitio Web", hideIfEmpty: true },
                  { key: "activo", label: "Activo", isBoolean: true, trueText: "Si­", falseText: "No" },
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
                      router.get(route('entidades.instituciones.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('entidades.instituciones.index'), {
                        nombre: filters.nombre,
                        tipo: filters.tipo,
                        pais: filters.pais,
                        provincia: filters.provincia,
                        localidad: filters.localidad,
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
                  <Label htmlFor="tipo">Tipo</Label>
                  <ComboBox
                    options={tipos}
                    value={filters.tipo}
                    onChange={(val) => setFilters({ ...filters, tipo: val ?? '' })}
                    placeholder="Seleccione un tipo"
                  />
                </div>
                <div>
                    <Label htmlFor="localidad">Localidad</Label>
                    <ComboBox
                        options={localidades}
                        value={filters.localidad}
                        onChange={(val) => setFilters({ ...filters, localidad: val ?? '' })}
                        placeholder="Seleccione una localidad"
                    />
                </div>
                <div>
                    <Label htmlFor="provincia">Provincia</Label>
                    <ComboBox
                        options={provincias}
                        value={filters.provincia}
                        onChange={(val) => setFilters({ ...filters, provincia: val ?? '' })}
                        placeholder="Seleccione una provincia"
                    />
                </div>
                <div>
                    <Label htmlFor="pais">Pais</Label>
                    <ComboBox
                        options={paises}
                        value={filters.pais}
                        onChange={(val) => setFilters({ ...filters, pais: val ?? '' })}
                        placeholder="Seleccione una pais"
                    />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!institucionToDelete}
              onCancel={() => {
                setInstitucionToDelete(null);
              }}
              onConfirm={() => {
                if (institucionToDelete) {
                  const id = institucionToDelete.id;
                  router.delete(route('entidades.instituciones.destroy', id));
                }
              }}
              title="¿Eliminar institucion?"
              description={`¿Estás seguro que deseas eliminar a ${institucionToDelete?.nombre || ''} ${institucionToDelete?.cuit || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
