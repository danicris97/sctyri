import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type ResultKind, BaseResult } from "@/types/search"

const statusClasses: Record<string, string> = {
  Abierto: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cerrado: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Vigente: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Próximo a vencer": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Renovado: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Cancelado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Vencido: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

const kindBorder: Record<ResultKind, string> = {
  convenio: "border-l-[#3e7fca]",
  expediente: "border-l-[#f97316]",
}

export function ResultCard({ result }: { result: BaseResult }) {
  const badgeClass = result.status ? statusClasses[result.status] ?? "bg-muted text-foreground" : ""
  const hasLink = Boolean(result.href)

  const card = (
    <Card
      className={cn(
        "border-l-4 mt-6 hover:shadow-md transition-all duration-200",
        kindBorder[result.kind],
        hasLink ? "cursor-pointer hover:scale-[1.01]" : undefined
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg text-[#0e3b64] dark:text-[#5a9fd4] mb-1 text-balance">{result.title}</CardTitle>
            {result.subtitle && (
              <CardDescription className="text-base">{result.subtitle}</CardDescription>
            )}
          </div>
          {result.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${badgeClass}`}>
              {result.status}
            </span>
          )}
        </div>
      </CardHeader>
      {result.stats?.length ? (
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {result.stats.slice(0, 4).map((s, i) => (
              <div key={i}>
                <span className="text-muted-foreground">{s.label}:</span>
                <p className="font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  )

  if (hasLink) {
    return (
      <a href={result.href} target="_blank" rel="noreferrer">
        {card}
      </a>
    )
  }

  return card
}
