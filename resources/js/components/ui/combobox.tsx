// combobox.tsx
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
  options:Option[]
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  className?: string
  defaultValue?: number | null
  disabled?: boolean
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "w-full",
  defaultValue = null,
  disabled = false,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const activeValue = value ?? defaultValue ?? null
  const selectedLabel =
    activeValue !== null
      ? options.find((opt) => opt.value === activeValue)?.label ?? placeholder
      : placeholder

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (selectedValue: number) => {
    if (disabled) return
    onChange(selectedValue === value ? null : selectedValue)
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
                        activeValue !== null && opt.value === activeValue
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
