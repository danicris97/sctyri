import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import DocumentosLayout from '@/layouts/admin/documents/layout';
import { useState, useEffect, useRef } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialogs/confirm-delete-dialog';
import { GenericDialog } from '@/components/dialogs/generic-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import { Option } from '@/types';
import { Resolution } from '@/types/resolution';
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resoluciones',
        href: route('documents.resolutions.index'),
    },
];

export default function ResolutionsIndex() {
    const { resolutions, files = [], types = [], search, sort, direction, toast: flashToast } = usePage().props as unknown as {
        resolutions: {
            data: Resolution[];
            current_page: number;
            last_page: number;
        };
        files: Option[];
        types: Option[];
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
          accessor: "number",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Fecha",
          accessor: "date",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Tipo",
          accessor: "type",
          sortable: true,
          width: '180px',
          align: 'center' as const,
        },
        {
          title: "Expediente",
          accessor: "file",
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

    const [resolutionToDelete, setResolutionToDelete] = useState<Resolution | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        file_id: '',
        date_since: '',
        date_until: '',
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
                        data={resolutions.data}
                        totalItems={resolutions.data.length}
                        columns={columns}
                        currentPage={resolutions.current_page}
                        totalPages={resolutions.last_page}
                        onPageChange={(page) => {
                            router.get(route('documents.resolutions.index'), {
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
                            router.get(route('documents.resolutions.index'), {
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
                            router.get(route('documents.resolutions.index'), { search: value }, {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        onNew={() => router.get(route('documents.resolutions.create'))}
                        onOpenFilter={() => {
                            setShowFilters(true);
                        }}
                        actionLinks={(row) => ({
                            view: () => route('documents.resolutions.show', row.id),
                            edit: route('documents.resolutions.edit', row.id),
                            delete: () => setResolutionToDelete(row),
                        })}
                    />
                </div>
            </DocumentosLayout>

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
                                router.get(route('documents.resolutions.index'));
                                setShowFilters(false);
                            }}
                        >
                            Limpiar
                        </Button>

                        <Button
                            className="bg-[#0e3b64] text-white hover:bg-[#3e7fca]"
                            onClick={() => {
                                router.get(route('documents.resolutions.index'), {
                                    type: filters.type,
                                    file_id: filters.file_id,
                                    date_since: filters.date_since,
                                    date_until: filters.date_until,
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
                        <Label htmlFor="type">Tipo</Label>
                        <ComboBox
                            options={types}
                            value={filters.type}
                            onChange={(val) => setFilters({ ...filters, type: val ?? '' })}
                            placeholder="Seleccione un tipo"
                        />
                    </div>
                    <div>
                        <Label htmlFor="file_id">Expediente</Label>
                        <ComboBox
                            options={files}
                            value={filters.file_id}
                            onChange={(val) => setFilters({ ...filters, file_id: val ?? '' })}
                            placeholder="Seleccione un expediente"
                        />
                    </div>
                            <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="date_since">Fecha desde</Label>
                        <Input
                        id="date_since"
                        type="date"
                        value={filters.date_since}
                        onChange={(e) => setFilters({ ...filters, date_since: e.target.value })}
                    />
                    </div>

                    <div>
                        <Label htmlFor="date_until">Fecha hasta</Label>
                        <Input
                        id="date_until"
                        type="date"
                        value={filters.date_until}
                        onChange={(e) => setFilters({ ...filters, date_until: e.target.value })}
                        />
                    </div>
                    </div>
                </div>
            </GenericDialog>

            <ConfirmDeleteDialog
                open={!!resolutionToDelete}
                onCancel={() => {
                    setResolutionToDelete(null);
                }}
                onConfirm={() => {
                    if (resolutionToDelete) {
                        const id = resolutionToDelete.id;
                        router.delete(route('documents.resolutions.destroy', id));
                    }
                }}
                title="¿Eliminar resolución?"
                description={`¿Estás seguro que deseas eliminar la resolución ${resolutionToDelete?.number || ''}? Esta acción no se puede deshacer.`}
            />
        </AppLayout>
    );
}
