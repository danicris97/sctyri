import type React from "react"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ComboBox } from "@/components/ui/combobox"
import type { ResolutionFormData } from "@/types/resolution"
import { Option } from "@/types"

type ResolucionSectionProps = {
  resolucion?: ResolutionFormData | null
  resoluciones_tipos: Option[]
  expedientes: Option[]
  onResolucionChange: (key: keyof ResolutionFormData, value: any) => void
  onOpenNewExpediente?: () => void
  errors: Record<string, string>
}

/** Helpers */
const pad = (n: string | number, len = 4) => String(n ?? "").replace(/\D/g, "").padStart(len, "0")
const yy = (y: number) => String(y).slice(-2)

/** Patrones por tipo (filename). El path siempre es https://bo.unsa.edu.ar/{tipo}/R{year}/ */
function filenameByTipo(tipo: string, year: number, numero: string) {
  const NUM3 = pad(numero, 3)
  const NUM4 = pad(numero, 4)
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

  const k = (tipo ?? "").toUpperCase()
  const def = (y: number) => `R-${k}-${y}-${NUM4}.pdf`
  const builder = map[k]
  return typeof builder === "function" ? builder(year, numero) : (builder ?? def(year))
}

const getLinkFromData = (tipo: string | null, fecha: string | null, numero: string | null) => {
  if (!tipo || !fecha || !numero) return ""
  const year = new Date(fecha).getFullYear()
  const base = "https://bo.unsa.edu.ar"
  const folder = (tipo ?? "").toLowerCase()
  const file = filenameByTipo(tipo, year, numero)
  return `${base}/${folder}/R${year}/${file}`
}

export function ResolucionSection({
  resolucion,
  resoluciones_tipos,
  expedientes,
  onResolucionChange,
  onOpenNewExpediente,
  errors,
}: ResolucionSectionProps) {
  const { getError, errorClass } = useErrors()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const key = name.split(".")[1] as keyof ResolucionFullType
    onResolucionChange(key, value)
  }

  // Autogeneración reactiva: si el link actual es "auto" (empieza con bo.unsa.edu.ar) lo reemplazamos
  useEffect(() => {
    if (!resolucion?.tipo || !resolucion?.fecha || !resolucion?.numero) return
    const autoLink = getLinkFromData(resolucion.tipo, resolucion.fecha, resolucion.numero)
    const current = resolucion.link ?? ""
    const isAuto = current === "" || current.startsWith("https://bo.unsa.edu.ar/")
    if (!isAuto) return
    if (current === autoLink) return
    onResolucionChange("link", autoLink)
  }, [resolucion?.tipo, resolucion?.fecha, resolucion?.numero, resolucion?.link, onResolucionChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
      <div>
        <Label htmlFor="resolucion.numero">Número de resolución *</Label>
        <Input
          name="resolucion.numero"
          placeholder="Número de resolución"
          value={resolucion?.numero ?? ""}
          onChange={handleInputChange}
          className={errorClass("resolucion.numero")}
        />
        {getError("convenio.resolucion.numero") && <p className="text-red-500 text-sm">{getError("convenio.resolucion.numero")}</p>}
      </div>

      <div>
        <Label htmlFor="resolucion.fecha">Fecha de resolución *</Label>
        <Input
          name="resolucion.fecha"
          type="date"
          value={resolucion?.fecha ?? ""}
          onChange={handleInputChange}
          className={errorClass("resolucion.fecha")}
        />
        {getError("resolucion.fecha") && <p className="text-red-500 text-sm">{getError("resolucion.fecha")}</p>}
      </div>

      <div>
        <Label htmlFor="resolucion.tipo">Tipo de resolución *</Label>
        <ComboBox
          options={resoluciones_tipos}
          value={resolucion?.tipo ?? ""}
          onChange={(val) => onResolucionChange("tipo", val && val !== "" ? val : null)}
          placeholder="Seleccione un tipo"
          className="w-full"
        />
        {getError("resolucion.tipo") && <p className="text-red-500 text-sm">{getError("resolucion.tipo")}</p>}
      </div>

      <div>
        <Label htmlFor="resolucion.expediente_id">Expediente *</Label>
        <div className="flex gap-2">
          <ComboBox
            options={expedientes}
            value={resolucion?.expediente_id != null ? String(resolucion.expediente_id) : null}
            onChange={(val) => {
              const expedienteId = val != null && val !== "" ? Number(val) : null
              onResolucionChange("expediente_id", expedienteId)
            }}
            placeholder="Seleccione un expediente"
            className="flex-1"
          />
          {onOpenNewExpediente && (
            <Button type="button" variant="outline" onClick={onOpenNewExpediente}>
              Nuevo
            </Button>
          )}
        </div>
        {getError("resolucion.expediente_id") && (
          <p className="text-red-500 text-sm">{getError("resolucion.expediente_id")}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="resolucion.link">Link de la resolución</Label>
        <Input
          name="resolucion.link"
          placeholder="https://bo.unsa.edu.ar/..."
          value={resolucion?.link ?? ""}
          onChange={handleInputChange}
          className={errorClass("resolucion.link")}
        />
        {getError("resolucion.link") && <p className="text-red-500 text-sm">{getError("resolucion.link")}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Se genera automáticamente (según tipo, fecha y número). Podés editarlo si el documento tiene otra URL.
        </p>
      </div>
    </div>
  )
}
