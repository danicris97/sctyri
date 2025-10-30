import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Option } from "@/types"

type ComboBoxProps = {
  options: Option[]
  value: string | number | null
  onChange: (value: string | null) => void
  placeholder?: string
  className?: string
  /** Valor por defecto opcional que se muestra si no hay selección */
  defaultValue?: string
  /** Deshabilita el combobox completo (botón y apertura) */
  disabled?: boolean
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "w-full",
  defaultValue,
  disabled = false,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const selectedLabel =
    options.find((opt) => String(opt.value) === value)?.label ??
    (defaultValue
      ? options.find((opt) => String(opt.value) === defaultValue)?.label
      : placeholder)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (selectedValue: string | number) => {
    if (disabled) return
    const normalized = String(selectedValue)
    onChange(normalized === value ? null : normalized)
    setOpen(false)
  }

  React.useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (containerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div
      className={cn(className, disabled && "opacity-60")}
      ref={containerRef}
      style={{ position: "relative" }}
      aria-disabled={disabled}
      data-disabled={disabled ? "" : undefined}
    >
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => !disabled && setOpen((o) => !o)}
        ref={buttonRef}
        disabled={disabled}
      >
        <span className="truncate max-w-[calc(100%-1.5rem)]">{selectedLabel}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
      </Button>

      {open && !disabled && (
        <div className="absolute left-0 mt-1 w-full max-w-[500px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
          <Command>
            <CommandInput
              placeholder="Buscar..."
              value={search}
              onValueChange={setSearch}
              autoFocus
              className="h-9"
            />
            <CommandList style={{ maxHeight: 200, overflowY: "auto" }}>
              {filteredOptions.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No se encontró resultado.
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        (value
                          ? String(opt.value) === value
                          : defaultValue
                            ? String(opt.value) === defaultValue
                            : false)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
