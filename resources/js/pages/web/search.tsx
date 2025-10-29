import PageLayout from "@/layouts/web/page-layout"
import Subtitle from "@/components/website/subtitle"
import { SearchPanel } from "@/components/website/search-panel"

export default function Search() {
  return (
    <PageLayout>
      <Subtitle title="BUSCADOR" />

      <div className="bg-white py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text">
          Buscar por texto o filtrar por campos.
        </h2>
      </div>

      <div className="relative min-h-[70vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
        <SearchPanel link="busqueda"/>
      </div>
    </PageLayout>
  )
}

