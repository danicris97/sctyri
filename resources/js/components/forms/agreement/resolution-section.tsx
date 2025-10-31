import type React from "react"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ComboBox } from "@/components/ui/combobox"
import type { ResolutionFormData } from "@/types/resolution"
import { Option } from "@/types"

type ResolutionSectionProps = {
  resolution?: ResolutionFormData | null
  resolutions_types: Option[]
  files: Option[]
  files_types: Option[]
  onResolutionChange: (key: keyof ResolutionFormData, value: any) => void
  onOpenNewFile?: () => void
  errors: Record<string, string>
}

/** Helpers */
const pad = (n: string | number, len = 4) => String(n ?? "").replace(/\D/g, "").padStart(len, "0")
const yy = (y: number) => String(y).slice(-2)

/** Patrones por type (filename). El path siempre es https://bo.unsa.edu.ar/{type}/R{year}/ */
function filenameBytype(type: string, year: number, number: string) {
  const NUM3 = pad(number, 3)
  const NUM4 = pad(number, 4)
  const map: Record<string, string | ((y: number, num: string) => string)> = {
    // Consejo Superior
    CS: (y, _) => `R-CS-${y}-${NUM3}.pdf`,
    // Dirección Rectorado con regla de extensión
    DR: (y, _) => `R-DR-${y}-${NUM4}.${y >= 1999 && y <= 2009 ? "html" : "pdf"}`,
    // Consejo/Decanato de Exactas
    CDEX: (y, _) => `RCD-${NUM3}-${y}-EXA-UNSa.pdf`,
    DEX: (y, _) => `RD-${NUM3}-${y}-EXA-UNSa.pdf`,
    // Naturales
    CDNAT: (y, _) => `R-CDNAT-${y}-${NUM4}.pdf`,
    DNAT: (y, _) => `R-DNAT-${y}-${NUM4}.pdf`,
    // Económicas
    CDECO: (y, _) => `R-CDECO-${y}-${NUM4}.pdf`,
    DECO: (y, _) => `R-DECO-${y}-${NUM4}.pdf`,
    // Salud – sin "R-" en filename
    CDSALUD: (y, _) => `CDSALUD-${y}-${NUM3}.pdf`,
    // Humanidades – formato "Res._NNNN_YY.pdf"
    CDH: (y, _) => `Res._${NUM4}_${yy(y)}.pdf`,
    DH: (y, _) => `Res._${NUM4}_${yy(y)}.pdf`,
    // Ingeniería – notar "CDI" en el filename
    CDING: (y, _) => `R-CDI-${y}-${NUM4}.pdf`,
    DING: (y, _) => `R-DING-${y}-${NUM4}.pdf`,
    // Forestal
    CDFRO: (y, _) => `Res.CA-SO-${NUM3}-${y}.pdf`,
    DFRO: (y, _) => `Res.${NUM3}-${y}.pdf`,
    // Rectorado SRO
    SRO: (y, _) => `Res.${NUM3}-${y}.pdf`,
    // FRMT
    CDFRMT: (y, _) => `R-CDFRMT-SES-UNSA-${y}-${NUM4}.pdf`,
    DFRMT: (y, _) => `R-FRMT-SES-UNSA-${y}-${NUM4}.pdf`,
    // SRT
    SRTCA: (y, _) => `R-CASRT-SES-UNSA-${y}-${NUM4}.pdf`,
    SRT: (y, _) => `R-SRT-SES-UNSA-${y}-${NUM4}.pdf`,
    // IEMT
    IEMT: (y, _) => `R-IEMTAR-${y}-${NUM4}.pdf`,
    // SRMRF
    SRMRF: (y, _) => `R-SRS-${y}-${NUM3}.pdf`,
    // Consejos de Investigación
    CCI: (y, _) => `R-CCI-${y}-${NUM4}.pdf`,
    CI: (y, _) => `R-CI-${y}-${NUM4}.pdf`,
  }

  const k = (type ?? "").toUpperCase()
  const def = (y: number) => `R-${k}-${y}-${NUM4}.pdf`
  const builder = map[k]
  return typeof builder === "function" ? builder(year, number) : (builder ?? def(year))
}

const getLinkFromData = (type: string | null, date: string | null, number: string | null) => {
  if (!type || !date || !number) return ""
  const year = new Date(date).getFullYear()
  const base = "https://bo.unsa.edu.ar"
  const folder = (type ?? "").toLowerCase()
  const file = filenameBytype(type, year, number)
  return `${base}/${folder}/R${year}/${file}`
}

export function ResolutionSection({
  resolution,
  resolutions_types,
  files,
  files_types,
  onResolutionChange,
  onOpenNewFile,
  errors,
}: ResolutionSectionProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const key = name.split(".")[1] as keyof ResolutionFormData
    onResolutionChange(key, value)
  }

  // Autogeneración reactiva: si el link actual es "auto" (empieza con bo.unsa.edu.ar) lo reemplazamos
  useEffect(() => {
    if (!resolution?.type || !resolution?.date || !resolution?.number) return
    const autoLink = getLinkFromData(resolution.type, resolution.date, resolution.number)
    const current = resolution.link ?? ""
    const isAuto = current === "" || current.startsWith("https://bo.unsa.edu.ar/")
    if (!isAuto) return
    if (current === autoLink) return
    onResolutionChange("link", autoLink)
  }, [resolution?.type, resolution?.date, resolution?.number, resolution?.link, onResolutionChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
      <div>
        <Label htmlFor="resolution.number">Número de Resolución *</Label>
        <Input
          name="resolution.number"
          placeholder="Número de resolución"
          value={resolution?.number ?? ""}
          onChange={handleInputChange}
          className={errors.resolution?.number ? "border-red-500" : ""}
        />
        {errors.resolution?.number && <p className="text-red-500 text-sm">{errors.resolution.number}</p>}
      </div>

      <div>
        <Label htmlFor="resolution.date">Fecha de Resolución *</Label>
        <Input
          name="resolution.date"
          type="date"
          value={resolution?.date ?? ""}
          onChange={handleInputChange}
          className={errors.resolution?.date ? "border-red-500" : ""}
        />
        {errors.resolution?.date && <p className="text-red-500 text-sm">{errors.resolution.date}</p>}
      </div>

      <div>
        <Label htmlFor="resolution.type">Tipo de resolución *</Label>
        <ComboBox
          options={resolutions_types}
          value={resolution?.type ?? ""}
          onChange={(val) => onResolutionChange("type", val && val !== "" ? val : null)}
          placeholder="Seleccione un type"
          className="w-full"
        />
        {errors.resolution?.type && <p className="text-red-500 text-sm">{errors.resolution.type}</p>}
      </div>

      <div>
        <Label htmlFor="resolution.expediente_id">Expediente *</Label>
        <div className="flex gap-2">
          <ComboBox
            options={files}
            value={resolution?.file_id != null ? String(resolution.file_id) : null}
            onChange={(val) => {
              const fileId = val != null && val !== "" ? Number(val) : null
              onResolutionChange("file_id", fileId)
            }}
            placeholder="Seleccione un expediente"
            className="flex-1"
          />
          {onOpenNewFile && (
            <Button type="button" variant="outline" onClick={onOpenNewFile}>
              Nuevo
            </Button>
          )}
        </div>
        {errors.resolution?.file_id && (
          <p className="text-red-500 text-sm">{errors.resolution.file_id}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="resolution.link">Link de la resolución</Label>
        <Input
          name="resolution.link"
          placeholder="https://bo.unsa.edu.ar/..."
          value={resolution?.link ?? ""}
          onChange={handleInputChange}
          className={errors.resolution?.link ? "border-red-500" : ""}
        />
        {errors.resolution?.link && <p className="text-red-500 text-sm">{errors.resolution.link}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Se genera automáticamente (según type, date y número). Podés editarlo si el documento tiene otra URL.
        </p>
      </div>
    </div>
  )
}
