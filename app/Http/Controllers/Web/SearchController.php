<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Enums\{
    AgreementEnum,
    AgreementRenewalEnum,
    FileEnum
};
use App\Models\{
    Agreement,
    Institution,
    Dependency,
    PersonPosition,
    File,
    Resolution,
    Person,
};
use Inertia\Inertia;
use App\Services\SearchService;
use App\Http\Requests\Web\SearchRequest;

class SearchController extends Controller
{
    public function index(SearchRequest $request, SearchService $service)
    { 
        $query = $request->get('q', '');

        $filters = [
            'agreement'   => $request->validated('agreement', []),
            'file' => $request->validated('file', []),
        ];

        $results = [];
        $trimmedQuery = trim((string) $query);
        $hasFilters = $this->filtersHaveValues($filters);

        if ($trimmedQuery !== '' || $hasFilters) {
            $results = $service->searchText($query, $filters);
        }

        return Inertia::render('web/search', [
            'q' => $query,
            'results' => $results,
            'filters' => $filters,
            'agreement_types' => AgreementEnum::options(),
            'institutions' => Institution::getOptions(),
            'dependencies' => Dependency::getOptions(),
            'person_positions' => PersonPosition::getOptionsNoStudent(),
            'files' => Files::getOptions(),
            'agreement_renewal_types' => AgreementRenewalEnum::options(),
            'files_types' => FileEnum::options(),
            'person' => Person::getOptions()
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
