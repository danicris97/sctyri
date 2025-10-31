import { BreadcrumbItem, Option } from "@/types"
import { Head, usePage, router } from "@inertiajs/react"
import { FilePenLine, Globe, FileCheck2, CalendarClock } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { DataTable } from "@/components/ui/data-table"
import { Agreement } from "@/types/agreement"
import AppLayout from "@/layouts/app-layout"
import AgreementLayout from "@/layouts/admin/agreements/layout"
import { useState, useEffect, useMemo } from "react"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { AgreementFiltersDialog } from "@/components/dialogs/agreement-filters-dialog"
import { toast } from "sonner"
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Convenios", href: route("agreements.agreements.index") },
]

type Stats = {
  count_agreements: number
  count_active: number
  count_last_semester: number
  count_international: number
  last_date: string | null
  formated_last_date?: string
  percentage_active?: number
  percentage_semester?: number
  percentage_international?: number
}

type AgreementPageProps = {
  agreements: {
    data: Agreement[]
    current_page: number
    last_page: number
  }
  search?: string
  sort?: string
  direction?: "asc" | "desc"
  toast?: {
    type: "success" | "error"
    message: string
  }
  agreement_types: Option[]
  institutions: Option[]
  dependecies: Option[]
  person_positions: Option[]
  resolutions: Option[]
  files: Option[]
  agreement_renewals_types: Option[]
  stats: Stats
}

export default function ConveniosIndex() {
  const {
    agreements,
    agreement_types,
    search,
    sort,
    direction,
    toast: flashToast,
    institutions,
    dependecies,
    person_positions,
    resolutions,
    files,
    agreement_renewals_types,
    stats,
  } = usePage().props as unknown as AgreementPageProps

  const columns = [
    { title: "Resolución", 
      accessor: "resolution_name", 
      sortable: false,
      width: "200px",
      align: "center" as const, 
    },
    { title: "Expediente", 
      accessor: "file_name", 
      sortable: false,
      width: "120px",
      align: "center" as const, 
    },
    { title: "Tipo", 
      accessor: "type", 
      sortable: true,
      width: "120px",
      align: "center" as const, 
    },
    {
      title: "Organización convenente",
      accessor: "institutions",
      sortable: false,
      render: (row: any) => row.institutions?.map((i: any) => i.name).join(", ") || "Sin asignar",
      width: "200px",
      align: "left" as const,
    },
    {
      title: "Fecha de Suscripción",
      accessor: "formated_date_signature",
      sortable: true,
      width: "140px",
      align: "center" as const,
    },
    {
      title: "Vigencia hasta",
      accessor: "formated_date_end",
      sortable: false,
      width: "130px",
      align: "center" as const,
    },
    {
      title: "Renovación hasta",
      accessor: "formated_date_renewal",
      sortable: false,
      width: "180px",
      align: "center" as const,
    },
    {
      title: "Unidad Académica",
      accessor: "dependencies",
      sortable: false,
      width: "200px",
      align: "center" as const,
      render: (row: any) => row.dependencies?.map((d: any) => d.name).join(", ") || "Sin asignar",
    },
    {
      title: "Link",
      accessor: "link",
      sortable: false,
      width: "120px",
      align: "center" as const,
      render: (row: any) => row.resolutions?.link ? (
        <a
          href={row.resolutions.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
          onClick={(e) => e.stopPropagation()}
        >
          Ver Resolución
        </a>
      ) : "Sin link",
    },
  ]

  //recurso de react para guardar en cache los calculos y evitar repetir un proceso de calculo con cada reload de pagina
  const statsList = useMemo(() => [
    {
      title: "Total de Convenios",
      value: stats.count_agreements.toString(),
      description: "Convenios registrados en el sistema",
      icon: FilePenLine,
      trend: "Ultimo registro: " + (stats.formated_last_date ?? "Sin registros"),
    },
    {
      title: "Convenios Activos",
      value: stats.count_active.toString(),
      description: "Convenios activos en el sistema",
      icon: FileCheck2,
      trend: `${stats.percentage_active}% del total`,
    },
    {
      title: "Convenios en el último semestre",
      value: stats.count_last_semester.toString(),
      description: "Firmados en los últimos 6 meses",
      icon: CalendarClock,
      trend: `${stats.percentage_semester}% del total`,
    },
    {
      title: "Convenios Internacionales",
      value: stats.count_international.toString(),
      description: "Convenios internacionales",
      icon: Globe,
      trend: `${stats.percentage_international}% del total`,
    },
  ], [stats])

  const [agreementToDelete, setAgreementToDelete] = useState<Agreement | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ 
    type: "",
    file_number: "",
    file_id: "",
    resolution_type: "",
    renewal_type: "",
    date_since: "",
    date_until: "",
    institution_id: "",
    dependency_id: "",
    person_position_id: "",
   })

   useEffect(() => {
    if (flashToast) {
      toast[flashToast.type](flashToast.message, {
        description: new Date().toLocaleString(),
      })
    }
  }, [flashToast])


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Convenios" />
      <AgreementLayout title="Convenios" description="Todos los convenios registrados en el sistema">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
          <DataTable
            title="Listado de Convenios"
            totalItems={agreements.data.length}
            data={agreements.data}
            columns={columns}
            currentPage={agreements.current_page}
            totalPages={agreements.last_page}
            onPageChange={(page) => {
              router.get(
                route("agreements.agreements.index"),
                {
                  page,
                  search: search,
                  sort,
                  direction,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              )
            }}
            onSort={(column, direction) => {
              router.get(
                route("agreements.agreements.index"),
                {
                  sort: column,
                  direction,
                  search: search,
                  page: 1,
                },
                {
                  preserveState: true,
                  replace: true,
                },
              )
            }}
            defaultSort={{ column: "created_at", direction: "desc" }}
            onSearch={(value) => {
              router.get(
                route("agreements.agreements.index"),
                { search: value },
                {
                  preserveState: true,
                  replace: true,
                },
              )
            }}
            onNew={() => router.get(route("agreements.agreements.create"))}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row) => ({
              view: () => route("agreements.agreements.show", row.id),
              edit: route("agreements.agreements.edit", row.id),
              delete: () => setAgreementToDelete(row),
            })}
            onExport={() => {
                // Combinar filtros aplicados con parámetros actuales de la URL
                const currentParams = new URLSearchParams(window.location.search);
                const exportParams = {
                  ...filters, // filtros del diálogo
                  search: currentParams.get('search') || '',
                  sort: currentParams.get('sort') || 'created_at',
                  direction: currentParams.get('direction') || 'desc',
                };
                
                // Crear URL
                const url = new URL(route("agreements.agreements.export"), window.location.origin);
                url.search = new URLSearchParams(exportParams).toString();
                
                // Crear un enlace temporal y hacer clic en él
                const link = document.createElement('a');
                link.href = url.toString();
                link.download = ''; // Esto sugiere al navegador que descargue el archivo
                link.style.display = 'none';
                
                // Agregar al DOM temporalmente
                document.body.appendChild(link);
                
                // Hacer clic programáticamente
                link.click();
                
                // Limpiar
                document.body.removeChild(link);
            }}
          />
        </div>
      </AgreementLayout>

      {/* Diálogo de filtros */}
      <AgreementFiltersDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        options={{
          agreement_types,
          institutions,
          dependecies,
          person_positions,
          files,
          agreement_renewal_types,
        }}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDeleteDialog
        open={!!agreementToDelete}
        onCancel={() => {
          setAgreementToDelete(null)
        }}
        onConfirm={() => {
          if (agreementToDelete) {
            const id = agreementToDelete.id
            router.delete(route("agreements.agreements.destroy", id))
          }
        }}
        title="¿Eliminar convenio?"
        description={`¿Estás seguro que deseas eliminar a ${agreementToDelete?.title || ""} ${agreementToDelete?.type || ""}? Esta acción no se puede deshacer.`}
      />
    </AppLayout>
  )
}
