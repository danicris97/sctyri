import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import clsx from "clsx";

export type StatItem = {
  label: string;
  value: React.ReactNode; // permite número/texto/formateado
};

export type CardStatsProps = {
  /** Valor principal grande */
  mainValue: React.ReactNode;
  /** Etiqueta bajo el valor principal (ej: "días promedio") */
  mainLabel?: string;
  /** Dos (o más) stats secundarios */
  items?: StatItem[]; // si vienen 2, se mostrarán lado a lado
  /** Título/subtítulo del card */
  title?: string;
  subtitle?: string;
  /** Ícono opcional (por defecto Clock) */
  icon?: React.ReactNode;
  /** clases extra */
  className?: string;
};

export function CardStats({
  mainValue,
  mainLabel = "",
  items = [],
  title = "Estadísticas",
  subtitle = "Resumen",
  icon,
  className,
}: CardStatsProps) {
  const IconWrap = icon ?? <Clock className="h-5 w-5" />;
  const gridCols = items.length === 0 ? "grid-cols-1" : items.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <Card className={clsx("border-[#0e3b64]/20 shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader>
        <CardTitle className="text-[#0e3b64] dark:text-[#5a9fd4] flex items-center gap-2">
          {IconWrap}
          {title}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-[#0e3b64] dark:text-[#5a9fd4] mb-2">{mainValue}</div>
            {mainLabel && <div className="text-sm text-muted-foreground">{mainLabel}</div>}
          </div>
          {items.length > 0 && (
            <div className={clsx("grid gap-4 pt-4 border-t", gridCols)}>
              {items.map((it, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-semibold text-[#3e7fca]">{it.value}</div>
                  <div className="text-xs text-muted-foreground">{it.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}