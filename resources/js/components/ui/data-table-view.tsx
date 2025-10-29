"use client"

import { useEffect, useRef, useCallback } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table"

interface InfiniteScrollOptions {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  threshold?: number // Distancia desde el bottom para activar (default: 100px)
}

interface DataTableProps {
  headers: string[]
  rows: any[][]
  onRowClick?: (rowData: any[]) => void
  infiniteScroll?: InfiniteScrollOptions // Nueva prop opcional
  maxHeight?: string // Para controlar la altura cuando hay infinite scroll
}

export function DataTableView({
  headers,
  rows,
  onRowClick,
  infiniteScroll,
  maxHeight = "500px", // Aumenté la altura por defecto
}: DataTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Función para detectar cuando el usuario está cerca del final
  const handleScroll = useCallback(() => {
    if (!infiniteScroll || !tableContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current
    const threshold = infiniteScroll.threshold || 100

    // Si está cerca del final y hay más datos por cargar
    if (scrollHeight - scrollTop - clientHeight < threshold && infiniteScroll.hasMore && !infiniteScroll.loading) {
      infiniteScroll.onLoadMore()
    }
  }, [infiniteScroll])

  // Agregar event listener para scroll
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container || !infiniteScroll) return

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [handleScroll, infiniteScroll])

  // Intersection Observer como alternativa más eficiente
  useEffect(() => {
    if (!infiniteScroll || !loadingRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && infiniteScroll.hasMore && !infiniteScroll.loading) {
          infiniteScroll.onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(loadingRef.current)
    return () => observer.disconnect()
  }, [infiniteScroll])

  const TableContent = (
    <Table className="table-fixed border border-slate-200">
      <TableHeader className="sticky top-0 z-10">

        {/* Header fijo para mejor UX */}
        <TableRow className="bg-[#0e3b65]">
          {headers.map((header, idx) => (
            <TableHead
              key={idx}
              className="text-white px-4 py-3 font-medium" // Mejoré el padding y agregué font-medium
              style={{
                wordWrap: "break-word",
                whiteSpace: "normal",
                width: `${100 / headers.length}%`,
                minWidth: "120px", // Ancho mínimo para evitar que se compriman demasiado
              }}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 && !infiniteScroll?.loading ? (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center py-8">

              {/* Más padding vertical */}
              <div className="text-gray-500">
                <div className="text-lg mb-2">No hay datos disponibles</div>
                <div className="text-sm">Intenta ajustar tus criterios de búsqueda</div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick ? "cursor-pointer hover:bg-blue-50 transition-colors" : ""} // Agregué transición suave
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="px-4 py-3 align-top break-words border-b border-gray-100" // Agregué borde inferior y mejoré padding
                    style={{
                      wordWrap: "break-word",
                      width: `${100 / headers.length}%`,
                      minWidth: "120px", // Ancho mínimo consistente
                      maxWidth: "300px", // Ancho máximo para evitar celdas muy anchas
                      whiteSpace: "normal", // Permite el wrap del texto
                      overflow: "hidden", // Evita desbordamiento
                      textOverflow: "ellipsis", // Puntos suspensivos si es necesario
                    }}
                  >
                    <div className="w-full">

                      {/* Wrapper para mejor control del contenido */}
                      {cell}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Loading indicator para infinite scroll */}
            {infiniteScroll && (
              <TableRow ref={loadingRef}>
                <TableCell colSpan={headers.length} className="text-center py-6">

                  {/* Más padding */}
                  {infiniteScroll.loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0e3b65]"></div>
                      {/* Spinner más grande */}
                      <span className="text-sm text-gray-600">Cargando más datos...</span>
                    </div>
                  ) : infiniteScroll.hasMore ? (
                    <span className="text-sm text-gray-400">Desplázate para cargar más</span>
                  ) : (
                    <span className="text-sm text-gray-400">No hay más datos</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </Table>
  )

  // Si tiene infinite scroll, envolver en contenedor con scroll SOLO para la tabla
  if (infiniteScroll) {
    return (
      <div className="w-full">

        {/* Contenedor principal */}
        <div
          ref={tableContainerRef}
          className="overflow-auto border border-slate-200 rounded-lg shadow-sm" // Mejoré el estilo del contenedor
          style={{
            maxHeight,
            scrollBehavior: "smooth", // Scroll suave
          }}
        >
          {TableContent}
        </div>
      </div>
    )
  }

  // Si no tiene infinite scroll, retornar como antes
  return (
    <div className="overflow-auto border border-slate-200 rounded-lg shadow-sm">

      {/* Wrapper consistente */}
      {TableContent}
    </div>
  )
}
