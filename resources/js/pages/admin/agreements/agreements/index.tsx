import type { BreadcrumbItem, DropdownOption } from "@/types"
import { Head, usePage, router } from "@inertiajs/react"
import { FilePenLine, Globe, FileCheck2, CalendarClock } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/ui/data-table"
import type { ConvenioFullType } from "@/schemas/convenio-schema"
import AppLayout from "@/layouts/app-layout"
import ConveniosLayout from "@/layouts/admin/convenios/layout"
import { useState, useEffect, useMemo } from "react"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { ConvenioDetailDialog } from "@/components/dialogs/convenio-detail-dialog"
import { ConvenioFiltersDialog } from "@/components/dialogs/convenio-filters-dialog"
import { toast } from "sonner"
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Convenios", href: route("convenios.convenios.index") },
]

type Stats = {
  total_convenios: number
  total_activos: number
  ultimo_semestre: number
  total_internacionales: number
  ultima_fecha: string | null
  ultima_fecha_texto?: string
  porcentaje_activos?: number
  porcentaje_semestre?: number
  porcentaje_internacionales?: number
}

type ConveniosPageProps = {
  convenios: {
    data: ConvenioFullType[]
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
  convenios_tipos: DropdownOption[]
  instituciones: DropdownOption[]
  unidades_academicas: DropdownOption[]
  firmantes_unsa: DropdownOption[]
  resoluciones: DropdownOption[]
  expedientes: DropdownOption[]
  renovaciones_convenios_tipos: DropdownOption[]
  stats: Stats
}

export default function ConveniosIndex() {
  const {
    convenios,
    convenios_tipos,
    search,
    sort,
    direction,
    toast: flashToast,
    instituciones,
    unidades_academicas,
    firmantes_unsa,
    expedientes,
    renovaciones_convenios_tipos,
    stats,
  } = usePage().props as unknown as ConveniosPageProps

  const columns = [
    { title: "Resolución", 
      accessor: "resolucion_texto", 
      sortable: false,
      width: "200px",
      align: "center" as const, 
    },
    { title: "Expediente", 
      accessor: "expediente_texto", 
      sortable: false,
      width: "120px",
      align: "center" as const, 
    },
    { title: "Tipo", 
      accessor: "tipo_convenio", 
      sortable: true,
      width: "120px",
      align: "center" as const, 
    },
    {
      title: "Organización convenente",
      accessor: "instituciones",
      sortable: false,
      render: (row: any) => row.instituciones?.map((i: any) => i.nombre).join(", ") || "Sin asignar",
      width: "200px",
      align: "left" as const,
    },
    {
      title: "Fecha de Suscripción",
      accessor: "fecha_firma_texto",
      sortable: true,
      width: "140px",
      align: "center" as const,
    },
    {
      title: "Vigencia hasta",
      accessor: "fecha_fin_texto",
      sortable: false,
      width: "130px",
      align: "center" as const,
    },
    {
      title: "Renovación hasta",
      accessor: "fecha_renovacion_vigente_texto",
      sortable: false,
      width: "180px",
      align: "center" as const,
    },
    {
      title: "Unidad Académica",
      accessor: "dependencias_unsa",
      sortable: false,
      width: "200px",
      align: "center" as const,
      render: (row: any) => row.dependencias_unsa?.map((d: any) => d.nombre).join(", ") || "Sin asignar",
    },
    {
      title: "Link",
      accessor: "link",
      sortable: false,
      width: "120px",
      align: "center" as const,
      render: (row: any) => row.resolucion?.link ? (
        <a
          href={row.resolucion.link}
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
      value: stats.total_convenios.toString(),
      description: "Convenios registrados en el sistema",
      icon: FilePenLine,
      trend: "Ultimo registro: " + (stats.ultima_fecha_texto ?? "Sin registros"),
    },
    {
      title: "Convenios Activos",
      value: stats.total_activos.toString(),
      description: "Convenios activos en el sistema",
      icon: FileCheck2,
      trend: `${stats.porcentaje_activos}% del total`,
    },
    {
      title: "Convenios en el último semestre",
      value: stats.ultimo_semestre.toString(),
      description: "Firmados en los últimos 6 meses",
      icon: CalendarClock,
      trend: `${stats.porcentaje_semestre}% del total`,
    },
    {
      title: "Convenios Internacionales",
      value: stats.total_internacionales.toString(),
      description: "Convenios internacionales",
      icon: Globe,
      trend: `${stats.porcentaje_internacionales}% del total`,
    },
  ], [stats])

  const [convenioToShow, setConvenioToShow] = useState<ConvenioFullType | null>(null)
  const [convenioToDelete, setConvenioToDelete] = useState<ConvenioFullType | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ 
    tipo_convenio: "",
    numero_expediente: "",
    expediente_id: "",
    anio_expediente: "",
    anio_resolucion: "",
    tipo_renovacion: "",
    internacional: "",
    fecha_desde: "",
    fecha_hasta: "",
    institucion_id: "",
    unidad_academica_id: "",
    firmante_unsa_id: "",
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
      <ConveniosLayout title="Convenios" description="Todos los convenios registrados en el sistema">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
          <DataTable
            title="Listado de Convenios"
            totalItems={convenios.data.length}
            data={convenios.data}
            columns={columns}
            currentPage={convenios.current_page}
            totalPages={convenios.last_page}
            onPageChange={(page) => {
              router.get(
                route("convenios.convenios.index"),
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
                route("convenios.convenios.index"),
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
                route("convenios.convenios.index"),
                { search: value },
                {
                  preserveState: true,
                  replace: true,
                },
              )
            }}
            onNew={() => router.get(route("convenios.convenios.create"))}
            onOpenFilter={() => setShowFilters(true)}
            actionLinks={(row) => ({
              view: () => setConvenioToShow(row),
              edit: route("convenios.convenios.edit", row.id),
              delete: () => setConvenioToDelete(row),
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
                const url = new URL(route("convenios.convenios.export"), window.location.origin);
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
      </ConveniosLayout>

      {/* Diálogo de detalles del convenio */}
      <ConvenioDetailDialog convenio={convenioToShow} onClose={() => setConvenioToShow(null)} />

      {/* Diálogo de filtros */}
      <ConvenioFiltersDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        options={{
          convenios_tipos,
          instituciones,
          unidades_academicas,
          firmantes_unsa,
          expedientes,
          renovaciones_convenios_tipos,
        }}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDeleteDialog
        open={!!convenioToDelete}
        onCancel={() => {
          setConvenioToDelete(null)
        }}
        onConfirm={() => {
          if (convenioToDelete) {
            const id = convenioToDelete.id
            router.delete(route("convenios.convenios.destroy", id))
          }
        }}
        title="¿Eliminar convenio?"
        description={`¿Estás seguro que deseas eliminar a ${convenioToDelete?.titulo || ""} ${convenioToDelete?.tipo_convenio || ""}? Esta acción no se puede deshacer.`}
      />
    </AppLayout>
  )
}
