import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Filter, Search as SearchIcon } from "lucide-react"
import { PageSearchFilters } from "@/components/dialogs/page-search-filters"
import type { SearchFilters, SearchOptions } from "@/types/search"

export function SearchBar({
  initialQuery = "",
  initialFilters,
  options,
  onSubmit,
}: {
  initialQuery?: string
  initialFilters?: Partial<SearchFilters>
  options?: SearchOptions
  onSubmit: (filters: SearchFilters) => void
}) {
  const [q, setQ] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({ q: initialQuery, ...initialFilters })

  const apply = () => {
    const payload: SearchFilters = { q, convenio: filters.convenio, expediente: filters.expediente }
    onSubmit(payload)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por convenio, expediente, institución, dependencia..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="pl-12 pr-32 h-14 text-base border-2 border-[#0e3b64]/30 focus:border-[#3e7fca] rounded-full shadow-sm"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 text-[#0e3b64] hover:bg-[#0e3b64]/10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex justify-center">
        <Button onClick={apply} className="bg-[#0e3b64] hover:bg-[#3e7fca] h-11 px-8 text-base rounded-full shadow-md hover:shadow-lg transition-all">
          <SearchIcon className="h-4 w-4 mr-2" /> Buscar
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-[#0e3b64] dark:text-[#5a9fd4]">Filtros de Búsqueda</DialogTitle>
            <DialogDescription>Refina tu búsqueda por tipo</DialogDescription>
          </DialogHeader>
          <PageSearchFilters
            value={filters}
            onChange={setFilters}
            options={options}
            onClear={() => setFilters({ q })}
            onApply={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}