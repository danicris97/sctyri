<?php

namespace App\Services;

use App\Models\{
    Agreement,
    File
};

class SearchService
{
    public function searchText($q, $filters = []): array
    {
        $trimmedQuery = trim($q);
        $needle = '%' . $trimmedQuery . '%';

        $fileFilters = $filters['file'] ?? [];
        $agreementFilters   = $filters['agreement'] ?? [];

        $hasFileFilters  = !empty(array_filter($fileFilters, fn ($v) => $v !== null && $v !== ''));
        $hasAgreementFilters = !empty(array_filter($agreementFilters,   fn ($v) => $v !== null && $v !== ''));

        // Si no hay filtros y q está vacío, no devolvemos nada
        if (!$hasFileFilters && !$hasAgreementFilters && $trimmedQuery === '') {
            return [];
        }

        $fileResults = [];
        $agreementResults   = [];

        // Debemos ejecutar la consulta de fileS si:
        // - hay filtros de file, O
        // - no hay filtros de ninguno (modo "q-only": buscamos en ambos por q)
        $shouldQueryFiles = $hasFileFilters || (!$hasFileFilters && !$hasAgreementFilters);

        if ($shouldQueryFiles) {
            $files = File::query()
                ->with(['dependency', 'causative'])
                ->when($hasFileFilters, function ($query) use ($fileFilters) {
                    $clean = array_filter($fileFilters, fn ($v) => $v !== null && $v !== '');
                    if (!empty($clean) && method_exists($query->getModel(), 'scopeFilter')) {
                        $query->filter($clean);
                    }
                })
                ->when($trimmedQuery !== '', function ($query) use ($needle) {
                    $query->where(function ($qq) use ($needle) {
                        $qq->where('number', 'LIKE', $needle)
                            ->orWhere('statement', 'LIKE', $needle)
                            ->orWhere('type', 'LIKE', $needle)
                            ->orWhere('year', 'LIKE', $needle)
                            ->orWhereHas('causantePersona', function ($q) use ($needle) {
                                $q->whereHas('persona', function ($p) use ($needle) {
                                    $p->where('name', 'LIKE', $needle)
                                      ->orWhere('apellido', 'LIKE', $needle)
                                      ->orWhere('dni', 'LIKE', $needle);
                                });
                            })
                            ->orWhereHas('causanteInstitucion', function ($q) use ($needle) {
                                $q->where('name', 'LIKE', $needle);
                            })
                            ->orWhereHas('causanteDependencia', function ($q) use ($needle) {
                                $q->where('name', 'LIKE', $needle);
                            })
                            ->orWhereRaw("CONCAT(number, '/', year) LIKE ?", [$needle]);
                    });
                })
                ->limit(100)
                ->get();

            $fileResults = $files->map(function (File $file) {
                $stats = [];

                if ($file->opening_date) {
                    $stats[] = [
                        'label' => 'Fecha de inicio',
                        'value' => $file->formated_opening_date,
                    ];
                }

                if ($file->closing_date) {
                    $stats[] = [
                        'label' => 'Fecha de cierre',
                        'value' => $file->formated_closing_date,
                    ];
                }

                if (!empty($file->last_movement_date)) {
                    $stats[] = [
                        'label' => 'Último movimiento',
                        'value' => $file->last_movement_date,
                    ];
                }

                if (!empty($file->last_movement_dependency)) {
                    $stats[] = [
                        'label' => 'Destino',
                        'value' => $file->last_movement_dependency,
                    ];
                }

                return [
                    'id' => $file->id,
                    'kind' => 'file',
                    'title' => $file->name,
                    'subtitle' => $file->causative_name,
                    'href' => null,
                    'status' => $file->status ?? null,
                    'stats' => $stats,
                ];
            })->all();
        }

        // Debemos ejecutar la consulta de agreementS si:
        // - hay filtros de agreement, O
        // - no hay filtros de ninguno (modo "q-only": buscamos en ambos por q)
        $shouldQueryAgreements = $hasAgreementFilters || (!$hasFileFilters && !$hasAgreementFilters);

        if ($shouldQueryAgreements) {
            $agreement = Agreement::query()
                ->with([
                    'resolution.file:id,number,year,dependecy_id',
                    'resolution.file.dependency:id,abbreviation,name',
                    'institutions:id,name',
                    'dependencies:id,name',
                ])
                ->when($hasAgreementFilters, function ($query) use ($agreementFilters) {
                    $clean = array_filter($agreementFilters, fn ($v) => $v !== null && $v !== '');

                    if (isset($clean['dependency_id'])) {
                        $query->whereHas('dependencies', function ($sub) use ($clean) {
                            $sub->where('dependecy.id', $clean['dependency_id']);
                        });
                        unset($clean['dependency_id']);
                    }

                    if (!empty($clean) && method_exists($query->getModel(), 'scopeFilter')) {
                        $query->filter($clean);
                    }
                })
                ->when($trimmedQuery !== '', function ($query) use ($needle) {
                    $query->where(function ($qq) use ($needle) {
                        $qq->where('type', 'LIKE', $needle)
                            ->orWhere('object', 'LIKE', $needle)
                            ->orWhere('observations', 'LIKE', $needle)
                            ->orWhereHas('institutions', function ($q) use ($needle) {
                                $q->where('name', 'LIKE', $needle);
                            })
                            ->orWhereHas('resolution.file', function ($q) use ($needle) {
                                $q->where('number', 'LIKE', $needle)
                                  ->orWhere('statement', 'LIKE', $needle)
                                  ->orWhere('type', 'LIKE', $needle)
                                  ->orWhereRaw("CONCAT(number, '/', year) LIKE ?", [$needle]);
                            });
                    });
                })
                ->limit(100)
                ->get();

            $agreementResults = $agreement->map(function (Agreement $agreement) {
                $file = optional($agreement->resolution)->file;
                $resolution = optional($agreement->resolution);
                $institutions = $agreement->institutions ?? collect();
                $institutionsText = $institutions->pluck('name')->take(5)->implode(' • ');
                $dependencies = $agreement->dependencies ?? collect();
                $dependenciesText = $dependencies->pluck('name')->take(5)->implode(' • ');

                $stats = [];
                if (!empty($agreement->date_signature)) {
                    $stats[] = [
                        'label' => 'Fecha de Firma',
                        'value' => $agreement->formated_date_signature,
                    ];
                }

                if (!empty($finTexto)) {
                    $stats[] = [
                        'label' => 'Vigente hasta',
                        'value' => $agreement->formated_date_end ?? 'Sin fecha de fin',
                    ];
                }

                if (!empty($resolution)) {
                    $stats[] = [
                        'label' => 'Resolución',
                        'value' => $resolution->name,
                    ];
                }

                if (!empty($resolution)) {
                    $stats[] = [
                        'label' => 'Fecha de Resolución',
                        'value' => $resolution->formated_date,
                    ];
                }

                return [
                    'id' => $agreement->id,
                    'kind' => 'agreement',
                    'title' => $agreement->title ?? 'Convenio',
                    'subtitle' => ($file->name . ' - ' . $dependenciesText) ?? ' ',
                    'href' => $agreement->resolution_link ?? $agreement->link ?? null,
                    'status' => $agreement->status ?? null,
                    'stats' => $stats,
                ];
            })->all();
        }

        // Merge según qué consultas se ejecutaron
        return array_values(array_merge($agreementResults, $fileResults));
    }
}
