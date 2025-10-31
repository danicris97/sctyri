import { BreadcrumbItem, Option } from '@/types'; // asegúrate que extiende de Inertia
import { Head, usePage, router } from '@inertiajs/react';
import { FileText, Calendar, Globe, Landmark } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { AgreementCancellation } from '@/types/agreement';
import AppLayout from '@/layouts/app-layout';
import AgreementsLayout from '@/layouts/admin/agreements/layout';
import { useState, useEffect } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from "ziggy-js";
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Baja de Convenios',
        href: route('agreements.cancellations.index'),
    },
];

// Estadísticas de ejemplo

export default function AgreementCancellationIndex() {
    const { agreementsCancellation, search, sort, direction, toast: flashToast, stats, agreements, resolutions, files, institutions, dependencies } = usePage().props as unknown as {
      agreementsCancellation: {
        data: AgreementCancellation[];
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
        count_last_cancellations: 0;
        count_cancellations: 0;
        count_institutions: 0;
        count_international: 0;
        last_date: string | null;
      };
      agreements: Option[];
      resolutions: Option[];
      files: Option[];
      institutions: Option[];
      dependencies: Option[];
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
        title: "Fecha de Baja",
        accessor: "formated_cancellation_date",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
      {
        title: "Motivo",
        accessor: "reason",
        sortable: true,
        width: '180px',
        align: 'center' as const,
      },
    ];

    const statsList = [
        {
          title: "Ultimas bajas",
          value: stats.count_last_cancellations.toString(),
          description: "Bajas de convenios en los ultimos 30 días",
          icon: FileText,
          trend: (stats.count_cancellations > 0 ? `${Math.round((stats.count_last_cancellations * 100) / stats.count_cancellations)}% del total` : "0% del total"),
        },
        {
          title: "Total de Bajas",
          value: stats.count_cancellations.toString(),
          description: "Bajas de convenios registradas en el sistema",
          icon: Calendar,
          trend: (stats.count_cancellations > 0 ? `${Math.round((stats.count_cancellations * 100) / stats.count_cancellations)}% del total` : "0% del total"),
        },
        /*{
          title: "Total de Instituciones",
          value: stats.count.toString(),
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
          trend: (stats.count > 0 ? `${Math.round((stats.total_internacionales * 100) / stats.count)}% del total` : "0% del total"),
        },*/
    ]

    const [AgreementCancellationToDelete, setAgreementCancellationToDelete] = useState<AgreementCancellation | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      date_since: '',
      date_until: '',
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
            <Head title="Bajas de Convenios"/>
            <AgreementsLayout title='Bajas de Convenios' description='Listado de bajas de convenios registradas en el sistema'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsList.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                  <DataTable
                    title="Listado de Bajas de Convenios"
                    data={agreementsCancellation.data}
                    totalItems={agreementsCancellation.data.length}
                    columns={columns}
                    currentPage={agreementsCancellation.current_page}
                    totalPages={agreementsCancellation.last_page}
                    onPageChange={(page) => {
                      router.get(route('agreements.cancellations.index'), {
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
                      router.get(route('agreements.cancellations.index'), {
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
                      router.get(route('agreements.cancellations.index'), { search: value, ...filters }, {
                        preserveState: true,
                        replace: true,
                      });
                    }}
                    onNew={() => router.get(route('agreements.cancellations.create'))}
                    onOpenFilter={() => setShowFilters(true)}
                    actionLinks={(row) => ({
                      view: () => route('agreements.cancellations.edit', row.id),
                      edit: route('agreements.cancellations.edit', row.id),
                      delete: () => setAgreementCancellationToDelete(row),
                    })}
                  />
                </div>
            </AgreementsLayout>

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
                      router.get(route('agreements.cancellations.index'));
                      setShowFilters(false);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                    onClick={() => {
                      router.get(route('agreements.cancellations.index'), {
                        date_since: filters.date_since,
                        date_until: filters.date_until,
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
                  <Label htmlFor="agreement_id">Convenio</Label>
                  <ComboBox
                    options={agreements.map((c) => ({
                      ...c,
                      value: String(c.value),
                    }))}
                    value={filters.agreement_id ? String(filters.agreement_id) : ""}
                    onChange={(val) => {
                      setFilters({ ...filters, agreement_id: val ?? '' })
                    }}
                    placeholder="Seleccione un convenio"
                    className="w-full"
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
              open={!!AgreementCancellationToDelete}
              onCancel={() => {
                setAgreementCancellationToDelete(null);
              }}
              onConfirm={() => {
                if (AgreementCancellationToDelete) {
                  const id = AgreementCancellationToDelete.id;
                  router.delete(route('agreements.cancellations.destroy', id));
                }
              }}
              title="¿Eliminar baja de convenio?"
              description={`¿Estás seguro que deseas eliminar la baja de convenio ${AgreementCancellationToDelete?.cancellation_date || ''}? Esta acción no se puede deshacer.`}
            />

        </AppLayout>
    );
}
