import { GenericDialog } from "@/components/dialogs/generic-dialog"
import { PageSearchFilters } from "@/components/dialogs/page-search-filters"
import type { SearchFilters, SearchOptions } from "@/types/search"

type PageFilterDialogProps = {
  open: boolean
  onClose: () => void
  /** estado de filtros (shape anidado que ya consume PageSearchFilters) */
  value: SearchFilters
  onChange: (f: SearchFilters) => void
  options?: SearchOptions
  /** llamado por el botón “Limpiar” dentro del contenido */
  onClear: () => void
  /**
   * Opcional: Hook del padre al aplicar.
   * Igual se cierra el diálogo SIEMPRE.
   */
  onApply?: () => void
  title?: string
  description?: string
}

export function PageFilterDialog({
  open,
  onClose,
  value,
  onChange,
  options,
  onClear,
  onApply,
  title = "Filtros de Búsqueda",
  description = "Refiná tu búsqueda por tipo",
}: PageFilterDialogProps) {
  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="xxl"
    >
      {/* El contenido ya incluye sus propios botones Limpiar / Aplicar */}
      <PageSearchFilters
        value={value}
        onChange={onChange}
        options={options}
        onClear={onClear}
        onApply={() => {
          // Disparamos side-effect externo si llega
          onApply?.()
          // Cerramos SIEMPRE el diálogo al aplicar
          onClose()
        }}
      />
    </GenericDialog>
  )
}
