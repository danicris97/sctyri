<?php

namespace App\Http\Controllers\Admin\Documents;

use App\Models\{
    Resolution,
    File
};
use App\Http\Requests\Admin\Documents\StoreResolutionRequest;
use App\Http\Requests\Admin\Documents\UpdateResolutionRequest;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ResolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $validSorts = ['number', 'date', 'type'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only([
            'type', 
            'file_id',
            'date_since',
            'date_until',
        ]);

        $resolutions = Resolution::with('file.dependency')
            ->search($search)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->through(fn($resolution) => [
                ...$resolution->toArray(),
                'file' => $resolution->file ? $resolution->file->name : 'No tiene',
                'file_dependency' => $resolution->file && $resolution->file->dependency ? $resolution->file->dependency->abbreviation : '',
        ]);

        return Inertia::render('admin/documentos/resoluciones/index', [
            'resolutions' => $resolutions,
            'search' => $search,
            'filters' => $filters,
            'sort' => $sort,
            'direction' => $direction,
            'types' => ResolutionEnum::options(),
            'files' => File::getOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/documents/resolutions/create', [
            'types' => ResolutionEnum::options(),
            'files' => File::getOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResolutionRequest $request)
    {
        $validated = $request->validated();
    
        try {
            $resolution = Resolution::create($validated);
    
            if ($request->expectsJson()) {
                // para submits via fetch/axios con Accept: application/json
                return response()->json($resolution, 201);
            }
    
            return redirect()
                ->route('documents.resolutions.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Resolución creada correctamente'
                ]);
        } catch (\Throwable $e) {
            \Log::error('Error al crear resolución', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Error al crear la resolución: ' . $e->getMessage(),
                ], 500);
            }
    
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error al crear la resolución: ' . $e->getMessage(),
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Resolution $resolution)
    {
        return Inertia::render('admin/documents/resolutions/show', [
            'resolution' => $resolution,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resolution $resolution)
    {
        return Inertia::render('admin/documents/resolutions/edit', [
            'resolution' => $resolution,
            'types' => ResolutionEnum::options(),
            'files' => File::getOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResolutionRequest $request, Resolution $resolution)
    {
        $validated = $request->validated();
        try {
            $resolution->update($validated);
            return redirect()->route('documents.resolutions.index')
                ->with('toast', ['type' => 'success', 'message' => 'Resolución actualizada correctamente']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la resolución: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resolution $resolution)
    {
        try {
            $resolution->delete();
            return redirect()->route('documents.resolutions.index')
                ->with('toast', ['type' => 'success', 'message' => 'Resolución eliminada correctamente']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar la resolución: ' . $e->getMessage()]);
        }
    }
}
