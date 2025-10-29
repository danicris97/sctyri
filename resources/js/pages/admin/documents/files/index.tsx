import { BreadcrumbItem, DropdownOption } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
//import { FileText, Users, Calendar, Globe } from 'lucide-react';
//import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { type ExpedienteFullType, ExpedienteType } from '@/schemas/expediente-schema';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documents/layout';
import { useState, useEffect, useRef } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { route } from "ziggy-js";
import ExpedienteDetailDialog from "@/components/dialogs/expediente-detail-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expedientes',
        href: route('documentos.expedientes.index'),
    },
];

type ExpedientesPageProps = {
    expedientes: {
        data: ExpedienteFullType[];
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
    dependencias: DropdownOption[];
    tipos: DropdownOption[];
    tipos_dependencias: DropdownOption[];
    tipos_instituciones: DropdownOption[];
    instituciones: DropdownOption[];
    roles: DropdownOption[];
    personas: DropdownOption[];
    personas_roles: DropdownOption[];
}

// Estadísticas de ejemplo
{/*const stats = [
    {
      title: "Total Personas",
      value: "156",
      description: "Personas registradas",
      icon: FileText,
      trend: "+12% desde el mes pasado",
    },
    {
      title: "Personas Activas",
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

export default function ExpedientesIndex() {
    const { 
      expedientes, 
      search, 
      sort, 
      direction, 
      toast: flashToast, 
      dependencias = [], 
      tipos = [], 
      instituciones = [],  
      personas = [], 
    } = usePage().props as unknown as ExpedientesPageProps
  
    const columns = [
      {
        title: "Número",
        accessor: "numero",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Año",
        accessor: "anio",
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
        title: "Dependencia",
        accessor: "dependencia",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const [expedienteToShow, setExpedienteToShow] = useState<ExpedienteType | null>(null);
    const [expedienteToDelete, setExpedienteToDelete] = useState<ExpedienteType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      anio: '',
      tipo: '',
      dependencia_id: '',
      causante_dependencia_id: '',
      causante_persona_id: '',
      causante_institucion_id: '',
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
                    data={expedientes.data}
                    totalItems={expedientes.data.length}
                    columns={columns}
                    currentPage={expedientes.current_page}
                    totalPages={expedientes.last_page}
                    onPageChange={(page) => {
                      router.get(route('documentos.expedientes.index'), {
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
                      router.get(route('documentos.expedientes.index'), {
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
                      router.get(route('documentos.expedientes.index'), { search: value }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('documentos.expedientes.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => setExpedienteToShow(row),
                      edit: route('documentos.expedientes.edit', row.id),
                      delete: () => setExpedienteToDelete(row),
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
                      router.get(route('documentos.expedientes.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('documentos.expedientes.index'), {
                        anio: filters.anio,
                        tipo: filters.tipo,
                        dependencia_id: filters.dependencia_id,
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
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    type="text"
                    value={filters.anio}
                    onChange={(e) => setFilters({ ...filters, anio: e.target.value })}
                  />
                </div>
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
                    <Label htmlFor="dependencia_id">Dependencia</Label>
                    <ComboBox
                        options={dependencias}
                        value={filters.dependencia_id}
                        onChange={(val) => setFilters({ ...filters, dependencia_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
                    />
                </div>
                <div>
                    <Label htmlFor="causante_dependencia_id">Causante Dependencia</Label>
                    <ComboBox
                        options={dependencias}
                        value={filters.causante_dependencia_id}
                        onChange={(val) => setFilters({ ...filters, causante_dependencia_id: val ?? '' })}
                        placeholder="Seleccione una dependencia"
                    />
                </div>
                <div>
                    <Label htmlFor="causante_institucion_id">Causante Institución</Label>
                    <ComboBox
                        options={instituciones}
                        value={filters.causante_institucion_id}
                        onChange={(val) => setFilters({ ...filters, causante_institucion_id: val ?? '' })}
                        placeholder="Seleccione una institución"
                    />
                </div>
                <div>
                    <Label htmlFor="causante_persona_id">Causante Persona</Label>
                    <ComboBox
                        options={personas}
                        value={filters.causante_persona_id}
                        onChange={(val) => setFilters({ ...filters, causante_persona_id: val ?? '' })}
                        placeholder="Seleccione una persona"
                    />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!expedienteToDelete}
              onCancel={() => {
                setExpedienteToDelete(null);
              }}
              onConfirm={() => {
                if (expedienteToDelete) {
                  const id = expedienteToDelete.id;
                  router.delete(route('documentos.expedientes.destroy', id));
                }
              }}
              title="¿Eliminar expediente?"
              description={`¿Estás seguro que deseas eliminar el expediente ${expedienteToDelete?.numero || ''}? Esta acción no se puede deshacer.`}
            />

            <ExpedienteDetailDialog
              open={!!expedienteToShow}
              onClose={() => setExpedienteToShow(null)}
              expediente={expedienteToShow}
              movimientos={expedienteToShow?.movimientos ?? []}
              resoluciones={expedienteToShow?.resoluciones ?? []}
            />

        </AppLayout>
    );
}
