<?php

namespace App\Services;

use App\Models\Convenio;
use App\Models\Expediente;

class BuscadorService
{
    public function searchText($q, $filters = []): array
    {
        $trimmedQuery = trim($q);
        $needle = '%' . $trimmedQuery . '%';

        $expedienteFilters = $filters['expediente'] ?? [];
        $convenioFilters   = $filters['convenio'] ?? [];

        $hasExpFilters  = !empty(array_filter($expedienteFilters, fn ($v) => $v !== null && $v !== ''));
        $hasConvFilters = !empty(array_filter($convenioFilters,   fn ($v) => $v !== null && $v !== ''));

        // Si no hay filtros y q está vacío, no devolvemos nada
        if (!$hasExpFilters && !$hasConvFilters && $trimmedQuery === '') {
            return [];
        }

        $expedienteResults = [];
        $convenioResults   = [];

        // Debemos ejecutar la consulta de EXPEDIENTES si:
        // - hay filtros de expediente, O
        // - no hay filtros de ninguno (modo "q-only": buscamos en ambos por q)
        $shouldQueryExpedientes = $hasExpFilters || (!$hasExpFilters && !$hasConvFilters);

        if ($shouldQueryExpedientes) {
            $expedientes = Expediente::query()
                ->with(['dependencia', 'causanteDependencia', 'causanteInstitucion', 'causantePersona'])
                ->when($hasExpFilters, function ($query) use ($expedienteFilters) {
                    $clean = array_filter($expedienteFilters, fn ($v) => $v !== null && $v !== '');
                    if (!empty($clean) && method_exists($query->getModel(), 'scopeFilter')) {
                        $query->filter($clean);
                    }
                })
                ->when($trimmedQuery !== '', function ($query) use ($needle) {
                    $query->where(function ($qq) use ($needle) {
                        $qq->where('numero', 'LIKE', $needle)
                            ->orWhere('extracto', 'LIKE', $needle)
                            ->orWhere('tipo', 'LIKE', $needle)
                            ->orWhere('anio', 'LIKE', $needle)
                            ->orWhereHas('causantePersona', function ($q) use ($needle) {
                                $q->whereHas('persona', function ($p) use ($needle) {
                                    $p->where('nombre', 'LIKE', $needle)
                                      ->orWhere('apellido', 'LIKE', $needle)
                                      ->orWhere('dni', 'LIKE', $needle);
                                });
                            })
                            ->orWhereHas('causanteInstitucion', function ($q) use ($needle) {
                                $q->where('nombre', 'LIKE', $needle);
                            })
                            ->orWhereHas('causanteDependencia', function ($q) use ($needle) {
                                $q->where('nombre', 'LIKE', $needle);
                            })
                            ->orWhereRaw("CONCAT(numero, '/', anio) LIKE ?", [$needle]);
                    });
                })
                ->limit(100)
                ->get();

            $expedienteResults = $expedientes->map(function (Expediente $expediente) {
                $stats = [];

                if ($expediente->fecha_inicio) {
                    $stats[] = [
                        'label' => 'Fecha de inicio',
                        'value' => optional($expediente->fecha_inicio)->format('d/m/Y'),
                    ];
                }

                if ($expediente->fecha_cierre) {
                    $stats[] = [
                        'label' => 'Fecha de cierre',
                        'value' => optional($expediente->fecha_cierre)->format('d/m/Y'),
                    ];
                }

                if (!empty($expediente->ultimo_movimiento_fecha)) {
                    $stats[] = [
                        'label' => 'Último movimiento',
                        'value' => $expediente->ultimo_movimiento_fecha,
                    ];
                }

                if (!empty($expediente->ultimo_movimiento_dependencia)) {
                    $stats[] = [
                        'label' => 'Destino',
                        'value' => $expediente->ultimo_movimiento_dependencia,
                    ];
                }

                return [
                    'id' => $expediente->id,
                    'kind' => 'expediente',
                    'title' => (string)($expediente->nombre ?? "Expediente #{$expediente->numero}"),
                    'subtitle' => (string)($expediente->causante_nombre ?? ''),
                    'href' => null,
                    'status' => $expediente->estado ?? null,
                    'stats' => $stats,
                ];
            })->all();
        }

        // Debemos ejecutar la consulta de CONVENIOS si:
        // - hay filtros de convenio, O
        // - no hay filtros de ninguno (modo "q-only": buscamos en ambos por q)
        $shouldQueryConvenios = $hasConvFilters || (!$hasExpFilters && !$hasConvFilters);

        if ($shouldQueryConvenios) {
            $convenios = Convenio::query()
                ->with([
                    'resolucion.expediente:id,numero,anio,dependencia_id',
                    'resolucion.expediente.dependencia:id,abreviatura,nombre',
                    'instituciones:id,nombre',
                    'dependenciasUnsa:id,nombre',
                ])
                ->when($hasConvFilters, function ($query) use ($convenioFilters) {
                    $clean = array_filter($convenioFilters, fn ($v) => $v !== null && $v !== '');

                    if (isset($clean['dependencia_id'])) {
                        $query->whereHas('dependenciasUnsa', function ($sub) use ($clean) {
                            $sub->where('dependencias_unsa.id', $clean['dependencia_id']);
                        });
                        unset($clean['dependencia_id']);
                    }

                    if (!empty($clean) && method_exists($query->getModel(), 'scopeFilter')) {
                        $query->filter($clean);
                    }
                })
                ->when($trimmedQuery !== '', function ($query) use ($needle) {
                    $query->where(function ($qq) use ($needle) {
                        $qq->where('tipo_convenio', 'LIKE', $needle)
                            ->orWhere('titulo', 'LIKE', $needle)
                            ->orWhere('objeto', 'LIKE', $needle)
                            ->orWhere('observaciones', 'LIKE', $needle)
                            ->orWhereHas('instituciones', function ($q) use ($needle) {
                                $q->where('nombre', 'LIKE', $needle);
                            })
                            ->orWhereHas('resolucion.expediente', function ($q) use ($needle) {
                                $q->where('numero', 'LIKE', $needle)
                                  ->orWhere('extracto', 'LIKE', $needle)
                                  ->orWhere('tipo', 'LIKE', $needle)
                                  ->orWhereRaw("CONCAT(numero, '/', anio) LIKE ?", [$needle]);
                            });
                    });
                })
                ->limit(100)
                ->get();

            $convenioResults = $convenios->map(function (Convenio $convenio) {
                $expediente = optional($convenio->resolucion)->expediente;
                $resolucion = optional($convenio->resolucion);
                $instituciones = $convenio->instituciones ?? collect();
                $institucionesTexto = $instituciones->pluck('nombre')->take(5)->implode(' • ');
                $dependencias = $convenio->dependenciasUnsa ?? collect();
                $dependenciasTexto = $dependencias->pluck('nombre')->take(5)->implode(' • ');

                $stats = [];
                if (!empty($convenio->fecha_firma)) {
                    $stats[] = [
                        'label' => 'Fecha de Firma',
                        'value' => (string)($convenio->fecha_firma->format('d/m/Y')),
                    ];
                }

                $finTexto = $convenio->fecha_renovacion_vigente ?? $convenio->fecha_fin;
                if (!empty($finTexto)) {
                    $stats[] = [
                        'label' => 'Vigente hasta',
                        'value' => (string)$finTexto->format('d/m/Y') ?? 'Sin fecha de fin',
                    ];
                }

                if (!empty($resolucion)) {
                    $stats[] = [
                        'label' => 'Resolución',
                        'value' => (string)$resolucion->nombre,
                    ];
                }

                if (!empty($resolucion)) {
                    $stats[] = [
                        'label' => 'Fecha de Resolución',
                        'value' => (string)$resolucion->fecha_ddmmyyyy,
                    ];
                }

                return [
                    'id' => $convenio->id,
                    'kind' => 'convenio',
                    'title' => (string)($convenio->titulo ?? ($convenio->tipo_convenio . ' - ' . $institucionesTexto) ?? 'Convenio'),
                    'subtitle' => ($expediente->nombre . ' - ' . $dependenciasTexto) ?? ' ',
                    'href' => $convenio->resolucion_link ?? $convenio->link ?? null,
                    'status' => $convenio->estado ?? null,
                    'stats' => $stats,
                ];
            })->all();
        }

        // Merge según qué consultas se ejecutaron
        return array_values(array_merge($convenioResults, $expedienteResults));
    }
}
