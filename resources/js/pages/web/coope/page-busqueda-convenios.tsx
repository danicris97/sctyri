import { usePage, router } from "@inertiajs/react"
import Subtitle from "@/components/website/subtitle"
import { DataTable } from "@/components/ui/data-table"
import type { ConvenioFullType } from "@/schemas/convenio-schema"
import { useState, useEffect } from "react"
import { PageConvenioFilters } from "@/components/dialogs/page-search-filters"
import { toast } from "sonner"
import "dayjs/locale/es"
import { route } from "ziggy-js" // Import route from ziggy-js
import dayjs from "dayjs"
import PageLayout from "@/layouts/web/page-layout"

dayjs.locale("es")

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
  } = usePage().props as unknown as {
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
    convenios_tipos: { value: string; label: string }[]
    instituciones: { value: number; label: string }[]
    unidades_academicas: { value: number; label: string }[]
    firmantes_unsa: { value: number; label: string }[]
    resoluciones: { value: number; label: string }[]
    expedientes: { value: number; label: string }[]
    renovaciones_convenios_tipos: { value: string; label: string }[]
  }

  const columns = [
    {
      title: "Resolución",
      accessor: "resolucion",
      sortable: false,
      width: "200px",
      align: "center" as const,
      render: (row: any) =>
        row.resolucion
          ? `RESOLUCIÓN - ${row.resolucion.numero.padStart(4, '0')} - ${new Date(row.resolucion.fecha).getFullYear()}`
          : "Sin resolución",
    },
    {
      title: "Expediente",
      accessor: "expediente",
      sortable: false,
      width: "120px",
      align: "center" as const,
      render: (row: any) =>
        row.resolucion?.expediente
          ? `${row.resolucion.expediente.numero}/${row.resolucion.expediente.anio}`
          : "Sin expediente",
    },
    {
      title: "Tipo",
      accessor: "tipo_convenio",
      sortable: true,
      width: "120px",
      align: "center" as const,
    },
    {
      title: "Organizacion conveniente",
      accessor: "instituciones",
      sortable: false,
      width: "250px",
      align: "left" as const,
      render: (row: any) =>
        row.instituciones?.length
          ? row.instituciones.map((i: any) => i.nombre).join(", ")
          : "Sin asignar",
    },
    {
      title: "Fecha de Suscripcion",
      accessor: "fecha_firma",
      sortable: true,
      width: "140px",
      align: "center" as const,
      render: (row: any) =>
        row.fecha_firma ? dayjs(row.fecha_firma).format("DD/MM/YYYY") : "Sin fecha",
    },
    {
      title: "Vigencia hasta",
      accessor: "fecha_fin",
      sortable: false,
      width: "130px",
      align: "center" as const,
      render: (row: any) =>
        row.fecha_fin ? dayjs(row.fecha_fin).format("DD/MM/YYYY") : "Sin fecha",
    },
    {
      title: "Renovación hasta",
      accessor: "fecha_renovacion_vigente",
      sortable: false,
      width: "180px",
      align: "center" as const,
      render: (row: any) => {
        const tipo = row.tipo_renovacion;
        if (tipo === "Sin Renovacion") {
          return "Sin renovación";
        }
        if (tipo === "Renovable de Comun Acuerdo") {
          return "Necesita acuerdo para renovar";
        }
        if(!row.fecha_renovacion_vigente || row.fecha_renovacion_vigente === row.fecha_fin){
          return "Todavía no renueva";
        }
    
        return dayjs(row.fecha_renovacion_vigente).format("DD/MM/YYYY");
      },
    },
    {
      title: "Unidad Academica",
      accessor: "dependencias_unsa",
      sortable: false,
      width: "200px",
      align: "left" as const,
      render: (row: any) =>
        row.dependencias_unsa?.length
          ? row.dependencias_unsa.map((u: any) => u.nombre).join(", ")
          : "Sin asignar",
    },
    {
      title: "Link",
      accessor: "link", // no se usa realmente
      sortable: false,
      width: "120px",
      align: "center" as const,
      render: (row: any) =>
        row.resolucion?.link ? (
          <a
            href={row.resolucion.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            Ver Resolución
          </a>
        ) : (
          "Sin link"
        ),
    },
  ]

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
    <PageLayout>
        <Subtitle title="BUSQUEDA DE CONVENIOS" />

        <div className="py-16 bg-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                CONVENIOS FIRMADOS ENTRE NUESTRA UNIVERSIDAD Y OTRAS INSTITUCIONES
            </h2>
        </div>

        {/* DataTable con márgenes y contenedor */}
        <div className="py-16 bg-white rounded-lg shadow-sm border p-6">
          <DataTable
              title="Listado de Convenios"
              description="Convenios registrados en el sistema: "
              totalItems={convenios.data.length}
              data={convenios.data}
              columns={columns}
              currentPage={convenios.current_page}
              totalPages={convenios.last_page}
              showActions={false}
              enableRowClick={false}
              onPageChange={(page) => {
                router.get(
                  route("coope.busqueda-convenios"),
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
                  route("coope.busqueda-convenios"),
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
                  route("coope.busqueda-convenios"),
                  { search: value },
                  {
                    preserveState: true,
                    replace: true,
                  },
                )
              }}
              onOpenFilter={() => setShowFilters(true)}
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
                const url = new URL(route("export.convenios"), window.location.origin);
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

      {/* Diálogo de filtros */}
      <PageConvenioFilters
        internacional={false}
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

    </PageLayout>
  )
}