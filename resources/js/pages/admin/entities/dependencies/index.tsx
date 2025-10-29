import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EntidadesLayout from '@/layouts/admin/entities/layout';
import { BreadcrumbItem, DropdownOption } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { type DependenciaUnsaType } from '@/schemas/dependencia-unsa-schema';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { SimpleDetailList, buildDetailItems } from "@/components/ui/simple-detail-list";
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dependencias UNSa',
        href: route('entidades.dependenciasUnsa.index'),
    },
];

type DependenciaUnsaIndexProps = {
  dependenciasUnsa: {
    data: DependenciaUnsaType[];
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
  tipos: DropdownOption[];
  localidades: DropdownOption[];
  provincias: DropdownOption[];
  dependencias_padre: DropdownOption[];
}

export default function DependenciasUnsaIndex() {
    const { 
      dependenciasUnsa, 
      localidades, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      tipos,
      provincias,
      dependencias_padre,
    } = usePage().props as unknown as DependenciaUnsaIndexProps;
  
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
        title: "Abreviatura",
        accessor: "abreviatura",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Dependencia Padre",
        accessor: "dependencia_padre",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const [dependenciaToShow, setDependenciaToShow] = useState<DependenciaUnsaType | null>(null);
    const [dependenciaToDelete, setDependenciaToDelete] = useState<DependenciaUnsaType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters , setFilters] = useState({
      tipo: '',
      localidad: '',
      provincia: '',
      dependencia_padre_id: '',
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
            <Head title="Dependencias UNSa"/>
            <EntidadesLayout title='Dependencias UNSa' description='Listado de dependencias UNSa'>
                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Dependencias UNSa"
                    data={dependenciasUnsa.data}
                    totalItems={dependenciasUnsa.data.length}
                    columns={columns}
                    currentPage={dependenciasUnsa.current_page}
                    totalPages={dependenciasUnsa.last_page}
                    onPageChange={(page: number) => {
                      router.get(route('entidades.dependenciasUnsa.index'), {
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
                      router.get(route('entidades.dependenciasUnsa.index'), {
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
                      router.get(route('entidades.dependenciasUnsa.index'), { 
                        search: value,
                      }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('entidades.dependenciasUnsa.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => setDependenciaToShow(row),
                      edit: route('entidades.dependenciasUnsa.edit', row.id),
                      delete: () => setDependenciaToDelete(row),
                    })}
                  />
                </div>
            </EntidadesLayout>

            <GenericDialog
              open={!!dependenciaToShow}
              onClose={() => setDependenciaToShow(null)}
              title="Detalles de la Dependencia UNSa"
              description="InformaciÃ³n completa de la dependencia UNSa"
              footer={
                <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" onClick={() => router.get(route('entidades.dependenciasUnsa.edit', dependenciaToShow?.id))}>
                  Editar
                </Button>
              }
            >
              {dependenciaToShow && (
                <SimpleDetailList
                  items={buildDetailItems(dependenciaToShow, [
                    { key: "nombre", label: "Nombre", hideIfEmpty: true },
                    { key: "tipo", label: "Tipo", hideIfEmpty: true },
                    { key: "abreviatura", label: "Abreviatura", hideIfEmpty: true },
                    {
                      key: "localidad",
                      label: "Localidad",
                      hideIfEmpty: true,
                      // convierte id â†’ etiqueta legible
                      //transform: (v) => (v ? locById?.[String(v)] ?? String(v) : "")
                    },
                    { key: "domicilio", label: "Domicilio", hideIfEmpty: true },
                    { key: "dependencia_padre", label: "Dependencia a la que pertenece", hideIfEmpty: true },
                    { key: "telefono", label: "Teléfono", hideIfEmpty: true },
                    { key: "email", label: "Email", hideIfEmpty: true },
                    // booleano con etiquetas â€œSÃ­/Noâ€
                    { key: "activo", label: "Activo", isBoolean: true, trueText: "Si­", falseText: "No" },
                  ])}
                />
              )}
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
                      router.get(route('entidades.dependenciasUnsa.index'));
                      setShowFilters(false);
                  }}>
                    Limpiar
                  </Button>
                  <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" 
                    onClick={() => {
                      router.get(route('entidades.dependenciasUnsa.index'), {
                        tipo: filters.tipo,
                        localidad: filters.localidad,
                        provincia: filters.provincia,
                        dependencia_padre_id: filters.dependencia_padre_id,
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
                        options={tipos}
                        value={filters.tipo}
                        onChange={(val) => setFilters({ ...filters, tipo: val ?? '' })}
                        placeholder="Seleccione un tipo"
                    />
                </div>
                <div>
                    <Label htmlFor="dependencia_padre">Dependencia</Label>
                    <ComboBox
                        options={dependencias_padre}
                        value={filters.dependencia_padre_id}
                        onChange={(val) => setFilters({ ...filters, dependencia_padre_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
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
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!dependenciaToDelete}
              onCancel={() => {
                setDependenciaToDelete(null);
              }}
              onConfirm={() => {
                if (dependenciaToDelete) {
                  const id = dependenciaToDelete.id;
                  router.delete(route('entidades.dependenciasUnsa.destroy', id));
                }
              }}
              title="¿Eliminar dependencia UNSa?"
              description={`¿Estás seguro que deseas eliminar la dependencia UNSa ${dependenciaToDelete?.nombre || ''}? Esta acción no se puede deshacer.`}
            />
        </AppLayout>
    );
}
