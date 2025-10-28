<?php

namespace App\Http\Controllers\Admin\Entities;

use App\Models\{
    Dependency, 
    Locality,
    Province,
    Country,
};
use App\Http\Requests\Admin\Entities\StoreDependencyRequest;
use App\Http\Requests\Admin\Entities\UpdateDependencyRequest;
use App\Http\Controllers\Controller;
use App\Enums\DependencyEnum;
use Illuminate\Http\Request;
use App\Actions\Entities\ResolveLocality;
use Inertia\Inertia;

class DependencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = [
            'name', 
            'type', 
            'abbreviation',
            'parent_dependency_id',
        ];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only([
            'type', 
            'locality', 
            'parent_dependency_id'
        ]);

        $dependencies = Dependency::with(
            'locality',  
        )->search($search)
        ->filter($filters)
        ->orderBy($sort, $direction)
        ->paginate(10)
        ->through(fn($dependency) => [
            ...$dependency->toArray(),
            'parent_dependency' => $dependency->parentDependency ? $dependency->parentDependency->abbreviation : 'No tiene',
            'locality' => $dependency->locality ? $dependency->locality->name : 'No esta cargado',
        ]);
        /*stats: dependencias totales, dependencias con convenio, dependencias con becarios, dependencias activas */

        return Inertia::render('admin/entities/dependency/index', [
            'dependencies' => $dependencies,
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'filters' => $filters,
            'types' => DependencyEnum::options(),
            'parent_dependencies' => Dependency::getOptions(),
            'localities' => Locality::getOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/entities/dependency/create', [
            'types' => DependencyEnum::options(),
            'parent_dependencies' => Dependency::getOptions(),
            'localities' => Locality::getOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDependencyRequest $request, ResolveLocality $resolveLocality)
    {
        try {
            $validated = $request->validated();
            // query para encontrar a la provincia de salta de argentina
            if(!$validated['locality_id']){
                $provinceId = Province::where('name', 'Salta')->orWhereHas('country', function ($query) {
                    $query->where('name', 'Argentina');
                })->first()->id;
                $validated['locality_id'] = $resolveLocality($validated['locality'], $provinceId);
            }

            $dependency = Dependency::create($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Dependencia creada correctamente',
                    'data' => $dependency
                ], 201);
            }

            return redirect()
                ->route('admin.entities.dependencies.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Dependencia creada correctamente'
                ]);

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Error al crear la dependencia: ' . $e->getMessage()
                ], 500);
            }

            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error al crear la dependencia: ' . $e->getMessage()
                ]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Dependency $dependency)
    {
        return Inertia::render('admin/entities/dependency/show', [
            'dependency' => $dependency,
            'parent_dependencies' => Dependency::getOptions(),
            'localities' => Locality::getOptions(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dependency $dependency)
    {
        return Inertia::render('admin/entities/dependency/edit', [
            'dependency' => $dependency,
            'parent_dependencies' => Dependency::getOptions($dependency->parent_dependency_id),
            'types' => DependencyEnum::options(),
            'localities' => Locality::getOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDependencyRequest $request, Dependency $dependency, ResolveLocality $resolveLocality)
    {
        try {
            $validated = $request->validated();
            
            if(!$validated['locality_id']){
                $provinceId = Province::where('name', 'Salta')->orWhereHas('country', function ($query) {
                    $query->where('name', 'Argentina');
                })->first()->id;
                $validated['locality_id'] = $resolveLocality($validated['locality'], $provinceId);
            }

            $dependency->update($validated);
            
            return redirect()->route('admin.entities.dependencies.index')
                ->with('toast', ['type' => 'success', 'message' => 'Dependencia actualizada con éxito.']);
        } catch (\Exception $e) {
            
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la Dependencia: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dependency $dependency)
    {
        try {
            $dependency->delete();
            return redirect()->route('admin.entities.dependencies.index')
                ->with('toast', ['type' => 'success', 'message' => 'Dependencia eliminada con éxito.']);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al eliminar la Dependencia: ' . $e->getMessage()]);
        }
    }
}
