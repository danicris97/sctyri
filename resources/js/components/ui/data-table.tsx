import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreVertical, ChevronUp, ChevronDown, Filter, Edit, Trash2, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Link } from "@inertiajs/react"

interface Column<T> {
  title: string
  accessor: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  width?: string
  align?: "left" | "center" | "right"
}

interface ActionLinks {
  view?: string | (() => void)
  edit: string
  delete?: string | (() => void)
}

interface DataTableProps<T extends object> {
  title: string
  description?: string
  data: T[]
  columns: Column<T>[]
  currentPage: number
  totalPages: number
  totalItems?: number // Total de items (para mostrar en búsquedas y filtros)
  onPageChange: (page: number) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  onSearch?: (value: string) => void
  onNew?: () => void
  onOpenFilter?: () => void
  actionLinks?: (row: T) => ActionLinks
  onExport?: () => void
  defaultSort?: { column: string; direction: "asc" | "desc" }
  showActions?: boolean // Nueva prop opcional
  enableRowClick?: boolean // Nueva prop para controlar el click en filas
}

export function DataTable<T extends object>({
  title,
  description,
  data,
  columns,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onSort,
  onSearch,
  onNew,
  onOpenFilter,
  actionLinks,
  onExport,
  defaultSort,
  showActions = true, // Por defecto true para retrocompatibilidad
  enableRowClick = true, // Por defecto true para retrocompatibilidad
}: DataTableProps<T>) {
  // Construir la descripción con el total si se proporciona
  const displayDescription = React.useMemo(() => {
    if (!description) {
      if (totalItems !== undefined) {
        return `Total de resultados: ${totalItems}`
      }
      return undefined
    }
    
    if (totalItems !== undefined) {
      return `${description}${totalItems}`
    }
    
    return description
  }, [description, totalItems])

  const [sort, setSort] = React.useState(defaultSort || { column: "", direction: "asc" })

  const handleSort = (column: string) => {
    const direction = sort.column === column && sort.direction === "asc" ? "desc" : "asc"
    setSort({ column, direction })
    onSort?.(column, direction)
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between"
        style={{ background: "linear-gradient(90deg, #468bd9, #0e3b65)" }}
      >
        <div className="text-white">
          <h2 className="text-xl font-semibold">{title}</h2>
          {displayDescription && <p className="text-sm opacity-80">{displayDescription}</p>}
        </div>
        <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end">
          <Input
            placeholder="Buscar..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-white min-w-[220px] flex-1 md:min-w-[260px]"
          />

          {onOpenFilter && (
            <Button variant="outline" onClick={onOpenFilter} className="flex-shrink-0 whitespace-nowrap">
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
          )}

          {onNew && (
            <Button className="bg-green-600 text-white hover:bg-green-700 flex-shrink-0 whitespace-nowrap" onClick={onNew}>
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </Button>
          )}

          {onExport && (
            <Button className="bg-orange-600 text-white hover:bg-orange-700 flex-shrink-0 whitespace-nowrap" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow style={{ backgroundColor: "#3e7fca" }}>
              {columns.map((col) => (
                <TableHead
                  key={col.accessor}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                  className={`text-white ${col.sortable ? "cursor-pointer select-none" : ""} ${
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                  } break-words px-4 py-3`}
                  style={{
                    width: col.width || "auto",
                    minWidth: col.width || "120px",
                    maxWidth: col.width || "300px",
                  }}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      col.align === "center"
                        ? "justify-center"
                        : col.align === "right"
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    {col.title}
                    {col.sortable &&
                      sort.column === col.accessor &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </TableHead>
              ))}
              {/* Solo renderizar el header de Acciones si showActions es true */}
              {showActions && (
                <TableHead className="w-24 text-center text-white break-words px-4 py-3">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={enableRowClick ? () => {
                    const viewLink = actionLinks?.(row)?.view
                    if (typeof viewLink === "string") {
                      window.location.href = viewLink
                    } else if (typeof viewLink === "function") {
                      viewLink()
                    }
                  } : undefined}
                  className={`${enableRowClick ? 'cursor-pointer' : ''} ${index % 2 === 0 ? "bg-white" : "bg-sky-50"}`}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.accessor}
                      className={`${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"} text-sm break-words px-4 py-4 leading-relaxed`}
                      style={{
                        width: col.width || "auto",
                        minWidth: col.width || "120px",
                        maxWidth: col.width || "300px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      <div className="break-words hyphens-auto">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.accessor] ?? "")}
                      </div>
                    </TableCell>
                  ))}
                  {/* Solo renderizar la celda de Acciones si showActions es true */}
                  {showActions && (
                    <TableCell className="w-24 text-center py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actionLinks?.(row)?.edit && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={actionLinks(row).edit}
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="w-4 h-4" /> Editar
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {actionLinks?.(row)?.delete && (
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-red-50 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                document.body.click()
                                setTimeout(() => {
                                  const del = actionLinks?.(row)?.delete
                                  if (typeof del === "function") {
                                    del()
                                  }
                                }, 50)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Borrar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Ajustar el colSpan basado en si se muestran las acciones o no */}
                <TableCell colSpan={columns.length + (showActions ? 1 : 0)} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} onClick={() => onPageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
