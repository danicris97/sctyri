import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: string
  icon?: React.ElementType
  className?: string
}

interface StatCardsProps {
  stats: StatCardProps[]
  columns?: number
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className = "",
}) => {
  return (
    <Card className={`border-blue-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-800">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-900">{value}</div>
        {description && <p className="text-xs text-blue-600 mt-1">{description}</p>}
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )
}

const StatCards: React.FC<StatCardsProps> = ({ stats, columns = 4 }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols] || gridCols[4]}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

export { StatCard, StatCards }
export default StatCards