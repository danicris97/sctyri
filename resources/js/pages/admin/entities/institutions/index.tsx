import { BreadcrumbItem, Option } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar, Globe, Landmark } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { Institution } from '@/types/institution';
import AppLayout from '@/layouts/app-layout';
import EntitiesLayout from '@/layouts/admin/entities/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { ComboBox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instituciones',
        href: route('entities.institutions.index'),
    },
];

type InstitutionsIndexProps = {
  institutions: {
    data: Institution[];
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
  types: Option[];
  countries: Option[];
  provinces: Option[];
  localities: Option[];
  stats: {
    last_count_institutions: 0;
    count_actives: 0;
    count_institutions: 0;
    count_international: 0;
    last_date: string | null;
  };
}

export default function InstitutionsIndex() {
    const {
      institutions, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      types,
      countries,
      provinces,
      localities,
      stats 
    } = usePage().props as unknown as InstitutionsIndexProps;

    const columns = [
      {
        title: "Nombre",
        accessor: "name",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Tipo",
        accessor: "type",
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
          value: stats.last_count_institutions.toString(),
          description: "Instituciones con las que se convenió en los ultimos 30 días",
          icon: FileText,
          trend: (stats.count_institutions > 0 ? `${Math.round((stats.last_count_institutions * 100) / stats.count_institutions)}% del total` : "0% del total"),
        },
        {
          title: "Instituciones con Convenio Activo",
          value: stats.count_actives.toString(),
          description: "Actualmente activas",
          icon: Calendar,
          trend: (stats.count_institutions > 0 ? `${Math.round((stats.count_actives * 100) / stats.count_institutions)}% del total` : "0% del total"),
        },
        {
          title: "Total de Instituciones",
          value: stats.count_institutions.toString(),
          description: "Instituciones registradas en el sistema",
          icon: Landmark,
          trend: stats.last_date ? `Último registro: ${new Intl.DateTimeFormat("es-AR", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(stats.last_date))}`
            : "Sin registros",
        },
        {
          title: "Instituciones Internacionales",
          value: stats.count_international.toString(),
          description: "Instituciones con convenios internacionales",
          icon: Globe,
          trend: (stats.count_institutions > 0 ? `${Math.round((stats.count_international * 100) / stats.count_institutions)}% del total` : "0% del total"),
        },
    ]

    const [institutionToDelete, setInstitutionToDelete] = useState<Institution | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      name: '',
      type: '',
      country: '',
      province: '',
      locality: '',
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
            <EntitiesLayout title='Instituciones' description='Listado de instituciones participantes de los convenios'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsList.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Instituciones"
                    data={institutions.data}
                    totalItems={institutions.data.length}
                    columns={columns}
                    currentPage={institutions.current_page}
                    totalPages={institutions.last_page}
                    onPageChange={(page) => {
                      router.get(route('entities.institutions.index'), {
                        page,
                        search: search, // este lo traés de props
                        sort,
                        direction,
                        name: filters.name,
                        type: filters.type,
                        country: filters.country,
                        province: filters.province,
                        locality: filters.locality,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}

                    onSort={(column, direction) => {
                      router.get(route('entities.institutions.index'), {
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
                      router.get(route('entities.institutions.index'), { search: value }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('entities.institutions.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => route('entities.institutions.show', row.id),
                      edit: route('entities.institutions.edit', row.id),
                      delete: () => setInstitutionToDelete(row),
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
                      router.get(route('entities.institutions.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('entities.institutions.index'), {
                        name: filters.name,
                        type: filters.type,
                        country: filters.country,
                        province: filters.province,
                        locality: filters.locality,
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
                    options={types}
                    value={filters.type}
                    onChange={(val) => setFilters({ ...filters, type: val ?? '' })}
                    placeholder="Seleccione un tipo"
                  />
                </div>
                <div>
                    <Label htmlFor="localidad">Localidad</Label>
                    <ComboBox
                        options={localities}
                        value={filters.locality}
                        onChange={(val) => setFilters({ ...filters, locality: val ?? '' })}
                        placeholder="Seleccione una localidad"
                    />
                </div>
                <div>
                    <Label htmlFor="provincia">Provincia</Label>
                    <ComboBox
                        options={provinces}
                        value={filters.province}
                        onChange={(val) => setFilters({ ...filters, province: val ?? '' })}
                        placeholder="Seleccione una provincia"
                    />
                </div>
                <div>
                    <Label htmlFor="pais">Pais</Label>
                    <ComboBox
                        options={countries}
                        value={filters.country}
                        onChange={(val) => setFilters({ ...filters, country: val ?? '' })}
                        placeholder="Seleccione una pais"
                    />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!institutionToDelete}
              onCancel={() => {
                setInstitutionToDelete(null);
              }}
              onConfirm={() => {
                if (institutionToDelete) {
                  const id = institutionToDelete.id;
                  router.delete(route('entities.institutions.destroy', id));
                }
              }}
              title="¿Eliminar institucion?"
              description={`¿Estás seguro que deseas eliminar a ${institutionToDelete?.name || ''} ${institutionToDelete?.cuit || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
