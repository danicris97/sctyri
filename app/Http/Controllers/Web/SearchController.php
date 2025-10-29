<?php

namespace App\Http\Controllers\website;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Enum\{
    ConvenioEnum,
    RenovacionConvenioEnum,
    ExpedienteEnum
};
use App\Models\{
    Convenio,
    Institucion,
    DependenciaUnsa,
    PersonaRol,
    Expediente,
    Resolucion,
    Persona,
};
use Inertia\Inertia;
use App\Services\BuscadorService;
use App\Http\Requests\Web\SearchRequest;

class BuscadorController extends Controller
{
    public function index(SearchRequest $request, BuscadorService $service)
    { 
        $query = $request->get('q', '');

        $filters = [
            'convenio'   => $request->validated('convenio', []),
            'expediente' => $request->validated('expediente', []),
        ];

        $results = [];
        $trimmedQuery = trim((string) $query);
        $hasFilters = $this->filtersHaveValues($filters);

        if ($trimmedQuery !== '' || $hasFilters) {
            $results = $service->searchText($query, $filters);
        }

        return Inertia::render('website/search', [
            'q' => $query,
            'results' => $results,
            'filters' => $filters,
            'convenios_tipos' => ConvenioEnum::options(),
            'instituciones' => Institucion::getDropdownOptions(),
            'dependencias' => DependenciaUnsa::getDropdownOptions(),
            'firmantes_unsa' => PersonaRol::getDropdownNoAlumnosOptions(),
            'expedientes' => Expediente::getDropdownOptions(),
            'renovaciones_convenios_tipos' => RenovacionConvenioEnum::options(),
            'expedientes_tipos' => ExpedienteEnum::options(),
            'personas' => Persona::getDropdownOptions()
        ]);
    }

    private function filtersHaveValues(array $filters): bool
    {
        foreach ($filters as $group) {
            if (!is_array($group)) {
                continue;
            }

            foreach ($group as $value) {
                if ($value !== null && $value !== '') {
                    return true;
                }
            }
        }

        return false;
    }
}
