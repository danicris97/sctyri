import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EntitiesLayout from '@/layouts/admin/entities/layout';
import { BreadcrumbItem, Option } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Dependency } from '@/types/dependency';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dependencias',
        href: route('entities.dependencies.index'),
    },
];

type DependenciesIndexProps = {
  dependencies: {
    data: Dependency[];
    current_page: number;
    last_page: number;
  };
  search?: string;
  sort?: string;
  filter?: string;
  direction?: 'asc' | 'desc';
  toast?: {
    type: 'success' | 'error';
    message: string;
  };
  types: Option[];
  localities: Option[];
  patern_dependencies: Option[];
}

export default function DependenciesIndex() {
    const { 
      dependencies, 
      localities, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      types,
      patern_dependencies,
    } = usePage().props as unknown as DependenciesIndexProps;
  
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
        title: "Abreviatura",
        accessor: "abbreviation",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Dependencia Padre",
        accessor: "patern_dependency",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const [dependencyToDelete, setDependencyToDelete] = useState<Dependency | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters , setFilters] = useState({
      type: '',
      locality: '',
      patern_dependency_id: '',
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
            <Head title="Dependencias"/>
            <EntitiesLayout title='Dependencias' description='Listado de dependencias'>
                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Dependencias"
                    data={dependencies.data}
                    totalItems={dependencies.data.length}
                    columns={columns}
                    currentPage={dependencies.current_page}
                    totalPages={dependencies.last_page}
                    onPageChange={(page: number) => {
                      router.get(route('entities.dependencies.index'), {
                        page,
                        search,
                        sort,
                        direction,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onSort={(column: string, direction: 'asc' | 'desc') => {
                      router.get(route('entities.dependencies.index'), {
                        sort: column,
                        direction,
                        search,
                        page: 1,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    defaultSort={{ column: 'created_at', direction: 'desc' }}
                    onSearch={(value: string) => {
                      router.get(route('entities.dependencies.index'), { 
                        search: value,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('entities.dependencies.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => route('entities.dependencies.show', row.id),
                      edit: route('entities.dependencies.edit', row.id),
                      delete: () => setDependencyToDelete(row),
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
                      router.get(route('entities.dependencies.index'));
                      setShowFilters(false);
                  }}>
                    Limpiar
                  </Button>
                  <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" 
                    onClick={() => {
                      router.get(route('entities.dependencies.index'), {
                        type: filters.type,
                        locality: filters.locality,
                        patern_dependency_id: filters.patern_dependency_id,
                      }, { preserveState: true });
                      setShowFilters(false);
                    }}>
                    Aplicar
                  </Button>
                </>
              }
            >
              <div className="space-y-4" ref={dialogContentRef}>
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
                    <Label htmlFor="dependencia_padre">Dependencia</Label>
                    <ComboBox
                        options={patern_dependencies}
                        value={filters.patern_dependency_id}
                        onChange={(val) => setFilters({ ...filters, patern_dependency_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
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
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!dependencyToDelete}
              onCancel={() => {
                setDependencyToDelete(null);
              }}
              onConfirm={() => {
                if (dependencyToDelete) {
                  const id = dependencyToDelete.id;
                  router.delete(route('entities.dependencies.destroy', id));
                }
              }}
              title="¿Eliminar dependencia?"
              description={`¿Estás seguro que deseas eliminar la dependencia ${dependencyToDelete?.name || ''}? Esta acción no se puede deshacer.`}
            />
        </AppLayout>
    );
}
