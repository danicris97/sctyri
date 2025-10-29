import type React from "react"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "./button"
import { Label } from "./label"
import { ComboBox } from "./combobox"
import { GenericDialog } from "./generic-dialog"

export type Option = {
  value: string
  label: string
}

type MultiSelectProps = {
  label: string
  options: Option[]
  selected?: Option[] // lista controlada
  onSelectedChange?: (selected: Option[]) => void
  withCreate?: boolean
  createForm?: (props: { onSuccess: (nuevo: unknown) => void }) => React.ReactNode
  onCreated?: (nuevo: unknown) => void
  placeholder?: string
  editRoute?: string // Nueva prop opcional para la ruta de edición
}

export function MultiSelect({
  label,
  options,
  selected = [],
  onSelectedChange,
  withCreate = false,
  createForm,
  onCreated,
  placeholder,
  editRoute,
}: MultiSelectProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [currentValue, setCurrentValue] = useState<string | null>(null)

  const availableOptions = options.filter(
    (opt) => !selected.some((sel) => sel.value === opt.value)
  )

  const handleAdd = (val: string | null) => {
    if (!val) return
    if (selected.some((sel) => sel.value === val)) {
      setCurrentValue(null)
      return
    }
    const opt = options.find((opt) => opt.value === val)
    if (opt) {
      onSelectedChange?.([...selected, opt])
    }
    setCurrentValue(null)
  }

  const handleRemove = (value: string) => {
    onSelectedChange?.(selected.filter((item) => item.value !== value))
  }

  const handleCreated = (nuevo: unknown) => {
    if (onCreated) onCreated(nuevo)
    setOpenDialog(false)
  }

  const generateEditUrl = (itemValue: string) => {
    if (!editRoute) return '#'
    return editRoute.replace(':id', itemValue)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <ComboBox
            options={availableOptions}
            placeholder={placeholder ?? `Filtrar y seleccionar ${label.toLowerCase()}`}
            onChange={(val) => {
              setCurrentValue(val)
              handleAdd(val)
            }}
            value={currentValue}
          />
        </div>
        {withCreate && createForm && (
          <Button type="button" size="sm" variant="outline" onClick={() => setOpenDialog(true)}>
            Nuevo
          </Button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
          {selected.map((item) => (
            <span
              key={item.value}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center text-sm"
            >
              {editRoute ? (
                <button
                  type="button"
                  className="hover:text-blue-900 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.visit(generateEditUrl(item.value));
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <span>{item.label}</span>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="ml-2 h-auto p-1 hover:bg-blue-200"
                onClick={() => handleRemove(item.value)}
              >
                ×
              </Button>
            </span>
          ))}
        </div>
      )}

      {withCreate && createForm && (
        <GenericDialog
          size="xxl"
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={`Crear ${label}`}
        >
          {createForm({ onSuccess: handleCreated })}
        </GenericDialog>
      )}
    </div>
  )
}