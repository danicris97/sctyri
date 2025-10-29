import { ResultCard } from "@/components/website/result-card"
import { type BaseResult } from "@/types"

export function ResultsList({
  title = "Resultados",
  results,
}: {
  title?: string
  results: BaseResult[]
}) {
  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0e3b64] dark:text-[#5a9fd4]">{title}</h3>
        <span className="text-sm text-muted-foreground">{results.length} encontrados</span>
      </div>
      {results.map((r) => (
        <ResultCard key={`${r.kind}-${r.id}`} result={r} />
      ))}
    </div>
  )
}
