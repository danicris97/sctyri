import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SearchPanel } from '@/components/web/search-panel';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts"
  
  const conveniosPorTipo = [
    { name: "Académicos", value: 45, color: "#0e3b64" },
    { name: "Investigación", value: 30, color: "#3e7fca" },
    { name: "Extensión", value: 15, color: "#10b981" },
    { name: "Servicios", value: 10, color: "#f59e0b" },
  ]
  
  // Mock data para el histograma de 12 meses
  const conveniosPorMes = [
    { mes: "Jul", firmados: 22, resueltos: 18 },
    { mes: "Ago", firmados: 19, resueltos: 16 },
    { mes: "Sep", firmados: 17, resueltos: 14 },
    { mes: "Oct", firmados: 21, resueltos: 17 },
    { mes: "Nov", firmados: 23, resueltos: 19 },
    { mes: "Dic", firmados: 18, resueltos: 15 },
  ]
  
  const renderCustomLabel = ({ cx, cy }: any) => {
    const total = conveniosPorTipo.reduce((sum, entry) => sum + entry.value, 0)
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.5em" fontSize="32" fontWeight="bold" fill="#0e3b64">
          {total}
        </tspan>
        <tspan x={cx} dy="1.5em" fontSize="14" fill="#64748b">
          Total Convenios
        </tspan>
      </text>
    )
  }

export default function Dashboard() {
    const promedioTiempo = 45
    const minimoTiempo = 30
    const maximoTiempo = 90
    const tasaResolucion = 82

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Convenios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-full">
                            <Card className="border-[#0e3b64]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                                <CardHeader>
                                    <CardTitle className="text-[#0e3b64] dark:text-[#5a9fd4]">Distribución por Tipo</CardTitle>
                                    <CardDescription>Convenios según categoría</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={conveniosPorTipo}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomLabel}
                                                outerRadius={90}
                                                innerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                animationBegin={0}
                                                animationDuration={1000}
                                            >
                                                {conveniosPorTipo.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                formatter={(value, entry: any) => `${value}: ${entry.payload.value}`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-full">
                            <Card className="border-[#0e3b64]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                                <CardHeader>
                                    <CardTitle className="text-[#0e3b64] dark:text-[#5a9fd4]">Convenios Últimos 12 Meses</CardTitle>
                                    <CardDescription>Firmados vs Resueltos por mes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={conveniosPorMes}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="firmados"
                                                fill="#0e3b64"
                                                name="Firmados"
                                                animationBegin={0}
                                                animationDuration={800}
                                                radius={[8, 8, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="resueltos"
                                                fill="#3e7fca"
                                                name="Resueltos"
                                                animationBegin={200}
                                                animationDuration={800}
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="h-full">
                        <Card className="border-[#0e3b64]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                            <CardHeader>
                                <CardTitle className="text-[#0e3b64] dark:text-[#5a9fd4] flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Estadísticas de Resolución
                                </CardTitle>
                                <CardDescription>Tiempos de procesamiento y tasa de éxito</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Tiempo Promedio */}
                                    <div className="text-center space-y-2">
                                        <div className="text-sm text-muted-foreground font-medium">Tiempo Promedio</div>
                                        <div className="text-4xl font-bold text-[#0e3b64] dark:text-[#5a9fd4]">{promedioTiempo}</div>
                                        <div className="text-xs text-muted-foreground">días</div>
                                    </div>

                                    {/* Mínimo */}
                                    <div className="text-center space-y-2">
                                        <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-1">
                                            <TrendingDown className="h-4 w-4 text-green-500" />
                                            Mínimo
                                        </div>
                                        <div className="text-4xl font-bold text-green-600 dark:text-green-500">{minimoTiempo}</div>
                                        <div className="text-xs text-muted-foreground">días</div>
                                    </div>

                                    {/* Máximo */}
                                    <div className="text-center space-y-2">
                                        <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-1">
                                            <TrendingUp className="h-4 w-4 text-orange-500" />
                                            Máximo
                                        </div>
                                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-500">{maximoTiempo}</div>
                                        <div className="text-xs text-muted-foreground">días</div>
                                    </div>

                                    {/* Tasa de Resolución */}
                                    <div className="text-center space-y-2">
                                        <div className="text-sm text-muted-foreground font-medium">Tasa de Resolución</div>
                                        <div className="text-4xl font-bold text-[#3e7fca]">{tasaResolucion}%</div>
                                        <div className="text-xs text-muted-foreground">resueltos</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <SearchPanel
                        title="Búsqueda"
                        description="Encuentra convenios, expedientes y resoluciones"
                        link="dashboard"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
