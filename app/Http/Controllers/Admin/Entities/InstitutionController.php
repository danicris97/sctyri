<?php

namespace App\Http\Controllers\Admin\Entities;

use App\Models\{
    Institution,
    Province,
    Country,
    Locality,
};
use App\Http\Requests\Admin\Entities\StoreInstitutionRequest;
use App\Http\Requests\Admin\Entities\UpdateInstitutionRequest;
use App\Http\Controllers\Controller;
use App\Enums\InstitutionEnum;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = [
            'name',
            'type',
            'cuit',
            'email'
        ];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only([
            'type', 
            'locality', 
            'province',
            'country'
        ]);

        $institutions = Institution::with(
            'locality', 
            'province', 
            'country'
        )->search($search)
        ->filter($filters)
        ->orderBy($sort, $direction)
        ->paginate(10)
        ->through(fn($institution) => [
            ...$institution->toArray(),
            'locality' => $institution->locality ? $institution->locality->name : 'No esta cargado',
            'province' => $institution->province ? $institution->province->name : 'No esta cargado',
            'country' => $institution->country ? $institution->country->name : 'No esta cargado',
        ]);

        // stats
        $last_institutions = Institution::whereHas('agreements', function($q) {
            $q->whereDate('fecha_firma', '>=', now()->subDays(30));
        })->count();
        $count_international = Institution::internacional()->count();
        $last_date = Institution::latest()->value('created_at');

        return Inertia::render('admin/entidades/instituciones/index', [
            'institutions' => $institutions,
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'filters' => $filters,
            'types' => InstitutionEnum::options(),
            'stats' => [
                'last_institutions' => $last_institutions,
                'count_with_agreements' => Institution::institutionsWithAgreements(),
                'count' => Institution::count(),
                'count_international' => $count_international,
                'last_date' => $last_date,
            ],
            'localities' => Locality::getOptions(),
            'provinces' => Province::getOptions(),
            'countries' => Country::getOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/entities/institution/create', [
            'types' => InstitutionEnum::options(),
            'localities' => Locality::getOptions(),
            'provinces' => Province::getOptions(),
            'countries' => Country::getOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstitutionRequest $request, ResolveLocality $resolveLocality, ResolveProvince $resolveProvince, ResolveCountry $resolveCountry)
    {
        try {
            $validated = $request->validated();

            if(!$validated['country_id']){
                $countryId = $resolveCountry($validated['country']);
            }else{
                $countryId = $validated['country_id'];
            }

            if(!$validated['province_id']){
                $provinceId = $resolveProvince($validated['province'], $countryId);
            }else{
                $provinceId = $validated['province_id'];
            }

            if(!$validated['locality_id']){
                $localityId = $resolveLocality($validated['locality'], $provinceId);
            }else{
                $localityId = $validated['locality_id'];
            }

            $validated['country_id'] = $countryId;
            $validated['province_id'] = $provinceId;
            $validated['locality_id'] = $localityId;

            $institution = Institution::create($validated);

            return redirect()->route('entities.institutions.index')
                ->with('toast', ['type' => 'success', 'message' => 'Institución creada con éxito.']);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al crear la institución: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Institution $institution)
    {
        return Inertia::render('admin/entities/institution/show', [
            'institution' => $institution,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Institution $institution)
    {
        return Inertia::render('admin/entities/institution/edit', [
            'institution' => $institution,
            'types' => InstitutionEnum::options(),
            'localities' => Locality::getOptions(),
            'provinces' => Province::getOptions(),
            'countries' => Country::getOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstitutionRequest $request, Institution $institution)
    {
        try {
            $validated = $request->validated();

            if(!$validated['country_id']){
                $countryId = $resolveCountry($validated['country']);
            }else{
                $countryId = $validated['country_id'];
            }

            if(!$validated['province_id']){
                $provinceId = $resolveProvince($validated['province'], $countryId);
            }else{
                $provinceId = $validated['province_id'];
            }

            if(!$validated['locality_id']){
                $localityId = $resolveLocality($validated['locality'], $provinceId);
            }else{
                $localityId = $validated['locality_id'];
            }

            $validated['country_id'] = $countryId;
            $validated['province_id'] = $provinceId;
            $validated['locality_id'] = $localityId;

            $institution->update($validated);

            return redirect()->route('entities.institutions.index')
                ->with('toast', ['type' => 'success', 'message' => 'Institución actualizada con éxito.']);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la institución: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institution $institution)
    {
        try {
            $institution->delete();
            return redirect()->route('entities.institutions.index')
                ->with('toast', ['type' => 'success', 'message' => 'Institución eliminada con éxito.']);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al eliminar la institución: ' . $e->getMessage()]);
        }
    }
}
