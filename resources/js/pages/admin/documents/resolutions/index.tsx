import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documentos/layout';
import { useState, useEffect, useRef } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { GenericDialog } from '@/components/ui/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { ResolucionFullType } from '@/schemas/resolucion-schema';
import { SimpleDetailList, buildDetailItems } from "@/components/ui/simple-detail-list";
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resoluciones',
        href: route('documentos.resoluciones.index'),
    },
];

export default function ResolucionesIndex() {
    const { resoluciones, expedientes = [], tipos = [], search, sort, direction, toast: flashToast } = usePage().props as unknown as {
        resoluciones: {
            data: ResolucionFullType[];
            current_page: number;
            last_page: number;
        };
        expedientes: { value: number; label: string }[];
        tipos: { value: number; label: string }[];
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        toast?: {
            type: 'success' | 'error';
            message: string;
        };
    };

    const columns = [
        {
          title: "Número",
          accessor: "numero",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Fecha",
          accessor: "fecha",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Tipo",
          accessor: "tipo",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Expediente",
          accessor: "expediente",
          sortable: false,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Link",
          accessor: "link",
          sortable: false,
          width: '180px',
          align: 'center' as const,
        },
    ];

    const [resolucionToShow, setResolucionToShow] = useState<ResolucionFullType | null>(null);
    const [resolucionToDelete, setResolucionToDelete] = useState<ResolucionFullType | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        tipo: '',
        expediente_id: '',
        fecha_desde: '',
        fecha_hasta: '',
    });
    const dialogContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (flashToast) {
            toast[flashToast.type](flashToast.message, {
                description: new Date().toLocaleString(),
            });
        }
    }, [flashToast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resoluciones" />
            <DocumentosLayout title="Resoluciones" description="Listado de resoluciones">
                <div className="flex h-full flex-grow flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <DataTable
                        title="Listado de Resoluciones"
                        data={resoluciones.data}
                        totalItems={resoluciones.data.length}
                        columns={columns}
                        currentPage={resoluciones.current_page}
                        totalPages={resoluciones.last_page}
                        onPageChange={(page) => {
                            router.get(route('documentos.resoluciones.index'), {
                                page,
                                search,
                                sort,
                                direction,
                            }, {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        onSort={(column, direction) => {
                            router.get(route('documentos.resoluciones.index'), {
                                sort: column,
                                direction,
                                search,
                                page: 1,
                            }, {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        defaultSort={{ column: 'created_at', direction: 'desc' }}
                        onSearch={(value) => {
                            router.get(route('documentos.resoluciones.index'), { search: value }, {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        onNew={() => router.get(route('documentos.resoluciones.create'))}
                        onOpenFilter={() => {
                            setShowFilters(true);
                        }}
                        actionLinks={(row) => ({
                            view: () => setResolucionToShow(row),
                            edit: route('documentos.resoluciones.edit', row.id),
                            delete: () => setResolucionToDelete(row),
                        })}
                    />
                </div>
            </DocumentosLayout>

            <GenericDialog
                open={!!resolucionToShow}
                onClose={() => setResolucionToShow(null)}
                title="Detalles de la Resolución"
                description="Información completa de la resolución seleccionada"
                footer={
                    <Button className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]" onClick={() => router.get(route('documentos.resoluciones.edit', resolucionToShow?.id))}>
                        Editar
                    </Button>
                }
            >
                <SimpleDetailList
                    items={buildDetailItems(resolucionToShow ?? {}, [
                    { key: "numero", label: "Numero", hideIfEmpty: true },
                    { key: "fecha", label: "Fecha", hideIfEmpty: true },
                    { key: "tipo", label: "Tipo", hideIfEmpty: true },
                    { key: "expediente", label: "Expediente", hideIfEmpty: true },
                    { key: "link", isLink: true, label: "Link", hideIfEmpty: true, transform: (v) => String(v ?? ""),hrefTransform: (v) => (v ? String(v) : undefined)},
                ])}
                />
            </GenericDialog>

            <GenericDialog
                open={showFilters}
                onClose={() => setShowFilters(false)}
                title="Filtros"
                description="Filtrar resultados de la tabla"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.get(route('documentos.resoluciones.index'));
                                setShowFilters(false);
                            }}
                        >
                            Limpiar
                        </Button>

                        <Button
                            className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                            onClick={() => {
                                router.get(route('documentos.resoluciones.index'), {
                                    tipo: filters.tipo,
                                    expediente_id: filters.expediente_id,
                                    fecha_desde: filters.fecha_desde,
                                    fecha_hasta: filters.fecha_hasta,
                                }, { preserveState: true });
                                setShowFilters(false);
                            }}
                        >
                            Buscar
                        </Button>
                    </>
                }
            >
                <div className="space-y-4" ref={dialogContentRef}>
                    <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <ComboBox
                            options={tipos}
                            value={filters.tipo}
                            onChange={(val) => setFilters({ ...filters, tipo: val ?? '' })}
                            placeholder="Seleccione un tipo"
                        />
                    </div>
                    <div>
                        <Label htmlFor="expediente_id">Expediente</Label>
                        <ComboBox
                            options={expedientes}
                            value={filters.expediente_id}
                            onChange={(val) => setFilters({ ...filters, expediente_id: val ?? '' })}
                            placeholder="Seleccione un expediente"
                        />
                    </div>
                            <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="fecha_desde">Fecha desde</Label>
                        <Input
                        id="fecha_desde"
                        type="date"
                        value={filters.fecha_desde}
                        onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                    />
                    </div>

                    <div>
                        <Label htmlFor="fecha_hasta">Fecha hasta</Label>
                        <Input
                        id="fecha_hasta"
                        type="date"
                        value={filters.fecha_hasta}
                        onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
                        />
                    </div>
                    </div>
                </div>
            </GenericDialog>

            <ConfirmDeleteDialog
                open={!!resolucionToDelete}
                onCancel={() => {
                    setResolucionToDelete(null);
                }}
                onConfirm={() => {
                    if (resolucionToDelete) {
                        const id = resolucionToDelete.id;
                        router.delete(route('documentos.resoluciones.destroy', id));
                    }
                }}
                title="¿Eliminar resolución?"
                description={`¿Estás seguro que deseas eliminar la resolución ${resolucionToDelete?.numero || ''}? Esta acción no se puede deshacer.`}
            />
        </AppLayout>
    );
}
