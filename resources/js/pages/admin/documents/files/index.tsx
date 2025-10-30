import { BreadcrumbItem, Option } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
//import { FileText, Users, Calendar, Globe } from 'lucide-react';
//import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { File } from '@/types/file';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documents/layout';
import { useState, useEffect, useRef } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expedientes',
        href: route('documents.files.index'),
    },
];

type ExpedientesPageProps = {
    files: {
        data: File[];
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
    dependencies: Option[];
    types: Option[];
    types_dependencies: Option[];
    types_institutions: Option[];
    institutions: Option[];
    positions: Option[];
    persons: Option[];
    person_positions: Option[];
}

// Estadísticas de ejemplo
{/*const stats = [
    {
      title: "Total persons",
      value: "156",
      description: "persons registradas",
      icon: FileText,
      trend: "+12% desde el mes pasado",
    },
    {
      title: "persons Activas",
      value: "89",
      description: "Actualmente activos",
      icon: Users,
      trend: "57% del total",
    },
    {
      title: "Próximos a Vencer",
      value: "8",
      description: "En los próximos 30 días",
      icon: Calendar,
      trend: "Requieren atención",
    },
    {
      title: "Internacionales",
      value: "23",
      description: "Convenios internacionales",
      icon: Globe,
      trend: "15% del total",
    },
]*/}

export default function FileIndex() {
    const { 
      files, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      dependencies = [], 
      types = [], 
      institutions = [],  
      persons = [], 
    } = usePage().props as unknown as ExpedientesPageProps
  
    const columns = [
      {
        title: "Número",
        accessor: "number",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Año",
        accessor: "year",
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
        title: "Dependencia",
        accessor: "dependency",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      year: '',
      type: '',
      dependency_id: '',
      causative_id: '',
      causative_type: '',
    });
    const dialogContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (flashToast) {
        toast[flashToast.type](flashToast.message, {
          description: new Date().toLocaleString(),
        });
      }
    }, [flashToast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expedientes"/>
            <DocumentosLayout title='Expedientes' description='Listado de expedientes'>
                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Expedientes"
                    data={files.data}
                    totalItems={files.data.length}
                    columns={columns}
                    currentPage={files.current_page}
                    totalPages={files.last_page}
                    onPageChange={(page) => {
                      router.get(route('documents.files.index'), {
                        page,
                        search: search, // este lo traés de props
                        sort,
                        direction,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}

                    onSort={(column, direction) => {
                      router.get(route('documents.files.index'), {
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
                      router.get(route('documents.files.index'), { search: value }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('documents.files.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => route('documents.files.show', row.id),
                      edit: route('documents.files.edit', row.id),
                      delete: () => setFileToDelete(row),
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
                      // Limpia los filtros reiniciando la página sin query params
                      router.get(route('documents.files.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('documents.files.index'), {
                        year: filters.year,
                        type: filters.type,
                        dependency_id: filters.dependency_id,
                        causative_id: filters.causative_id,
                        causative_type: filters.causative_type,
                      }, { preserveState: true });
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
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    type="text"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  />
                </div>
                <div>
                    <Label htmlFor="type">Tipo</Label>
                    <ComboBox
                        options={types}
                        value={filters.type}
                        onChange={(val) => setFilters({ ...filters, type: val ?? '' })}
                        placeholder="Seleccione un tipo"
                    />
                </div>
                <div>
                    <Label htmlFor="dependency_id">Dependencia</Label>
                    <ComboBox
                        options={dependencies}
                        value={filters.dependency_id}
                        onChange={(val) => setFilters({ ...filters, dependency_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
                    />
                </div>
                <div>
                    <Label htmlFor="causative_id">Causante</Label>
                    <ComboBox
                        options={dependencies}
                        value={filters.causative_id}
                        onChange={(val) => setFilters({ ...filters, causative_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
                    />
                </div>
                <div>
                    <Label htmlFor="causative_type">Tipo de Causante</Label>
                    <ComboBox
                        options={institutions}
                        value={filters.causative_type}
                        onChange={(val) => setFilters({ ...filters, causative_type: val ?? '' })}
                        placeholder="Seleccione una institución"
                    />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!fileToDelete}
              onCancel={() => {
                setFileToDelete(null);
              }}
              onConfirm={() => {
                if (fileToDelete) {
                  const id = fileToDelete.id;
                  router.delete(route('documents.files.destroy', id));
                }
              }}
              title="¿Eliminar archivo?"
              description={`¿Estás seguro que deseas eliminar el archivo ${fileToDelete?.number || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
