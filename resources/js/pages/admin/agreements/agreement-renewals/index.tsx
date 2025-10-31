import { BreadcrumbItem, Option } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { AgreementRenewal } from '@/types/agreement';
import AppLayout from '@/layouts/app-layout';
import ConveniosLayout from '@/layouts/admin/agreements/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { ComboBox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Renovaciones de Convenios',
        href: route('agreement.renewals.index'),
    },
];

// Estadísticas de ejemplo

export default function AgreementRenewalsIndex() {
    const { agreementRenewals, search, sort, direction, toast: flashToast, types = [], agreements = [], files = [], institutions = [], dependencies = [], stats } = usePage().props as unknown as {
      agreementRenewals: {
        data: AgreementRenewal[];
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
      types: Option[];
      agreements: Option[];
      files: Option[];
      institutions: Option[];
      dependencies: Option[];
      stats: {
        last_renewals: 0;
        count_renewals: 0;
        last_date: string | null;
      };
    };

    const columns = [
      {
        title: "Convenio",
        accessor: "agreement_name",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Fecha de Inicio",
        accessor: "formated_start_date",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Duración",
        accessor: "duration",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Fecha de Fin",
        accessor: "formated_closing_date",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const statsList = [
        {
          title: "Ultimas renovaciones",
          value: stats.last_renewals.toString(),
          description: "Renovaciones de convenios en los ultimos 30 días",
          icon: FileText,
          trend: (stats.count_renewals > 0 ? `${Math.round((stats.last_renewals * 100) / stats.count_renewals)}% del total` : "0% del total"),
        },
        {
          title: "Total de Renovaciones",
          value: stats.count_renewals.toString(),
          description: "Renovaciones de convenios registradas en el sistema",
          icon: Calendar,
          trend: (stats.count_renewals > 0 ? `${Math.round((stats.count_renewals * 100) / stats.count_renewals)}% del total` : "0% del total"),
        },
        /*{
          title: "Total de Instituciones",
          value: stats.total_instituciones.toString(),
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
          value: stats.total_internacionales.toString(),
          description: "Instituciones con convenios internacionales",
          icon: Globe,
          trend: (stats.total_instituciones > 0 ? `${Math.round((stats.total_internacionales * 100) / stats.total_instituciones)}% del total` : "0% del total"),
        },*/
    ]

    const [agreementRenewalToDelete, setAgreementRenewalToDelete] = useState<AgreementRenewal | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      date_since: '',
      date_until: '',
      type_renewal: '',
      agreement_id: '',
      file_id: '',
      institution_id: '',
      dependency_id: '',
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
                    data={agreementRenewals.data}
                    totalItems={agreementRenewals.data.length}
                    columns={columns}
                    currentPage={agreementRenewals.current_page}
                    totalPages={agreementRenewals.last_page}
                    onPageChange={(page) => {
                      router.get(route('agreement.renewals.index'), {
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
                      router.get(route('agreement.renewals.index'), {
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
                      router.get(route('agreement.renewals.index'), { search: value, ...filters }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => route('agreement.renewals.create')}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => route('agreement.renewals.show', { agreementRenewal: row.id }),
                      edit: route('agreement.renewals.edit', { agreementRenewal: row.id }),
                      delete: () => setAgreementRenewalToDelete(row),
                    })}
                  />
                </div>
            </ConveniosLayout>

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
                      // Limpia los filtros reiniciando la pagina sin query params
                      router.get(route('agreement.renewals.index'), { ...filters }, { preserveState: true });
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('agreement.renewals.index'), {
                        date_since: filters.date_since,
                        date_until: filters.date_until,
                        type_renewal: filters.type_renewal,
                        agreement_id: filters.agreement_id,
                        file_id: filters.file_id,
                        institution_id: filters.institution_id,
                        dependency_id: filters.dependency_id,
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
                <div>
                  <Label htmlFor="type_renewal">Tipo de renovación</Label>
                  <ComboBox
                    options={types}
                    value={filters.type_renewal}
                    onChange={(val) => setFilters({ ...filters, type_renewal: val ?? '' })}
                    placeholder="Seleccione un tipo"
                  />
                </div>
                <div>
                  <Label htmlFor="agreement_id">Convenio</Label>
                  <ComboBox
                    options={agreements}
                    value={filters.agreement_id}
                    onChange={(val) => setFilters({ ...filters, agreement_id: val ?? '' })}
                    placeholder="Seleccione un convenio"
                  />
                </div>
                <div>
                  <Label htmlFor="file_id">Expediente</Label>
                  <ComboBox
                    options={files.map((e) => ({
                      ...e,
                      value: String(e.value),
                    }))}
                    value={filters.file_id ? String(filters.file_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, file_id: val ?? '' })
                    }}
                    placeholder="Seleccione un expediente"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="institution_id">Institución</Label>
                  <ComboBox
                    options={institutions.map((inst) => ({
                      ...inst,
                      value: String(inst.value),
                    }))}
                    value={filters.institution_id ? String(filters.institution_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, institution_id: val ?? '' })
                    }}
                    placeholder="Seleccione una institución"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="dependency_id">Unidad Académica</Label>
                  <ComboBox
                    options={dependencies.map((d) => ({
                      ...d,
                      value: String(d.value),
                    }))}
                    value={filters.dependency_id ? String(filters.dependency_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, dependency_id: val ?? '' })
                    }}
                    placeholder="Seleccione una unidad académica"
                    className="w-full"
                  />
                </div>
              </div>
            </GenericDialog>

            <ConfirmDeleteDialog
              open={!!agreementRenewalToDelete}
              onCancel={() => {
                setAgreementRenewalToDelete(null);
              }}
              onConfirm={() => {
                if (agreementRenewalToDelete) {
                  const id = agreementRenewalToDelete.id;
                  route('agreement.renewals.destroy', id);
                }
              }}
              title="¿Eliminar renovación de convenio?"
              description={`¿Estás seguro que deseas eliminar la renovación de convenio ${agreementRenewalToDelete?.agreement_name + ' ' + agreementRenewalToDelete?.formated_start_date || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
