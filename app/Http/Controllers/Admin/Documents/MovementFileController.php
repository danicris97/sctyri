<?php

namespace App\Http\Controllers\Admin\Documents;

use App\Models\{
    MovementFile,
    File,
    Dependency
};
use App\Http\Requests\Admin\Documents\StoreMovementFileRequest;
use App\Http\Requests\Admin\Documents\UpdateMovementFileRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovementFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = ['date', 'folios'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only([
            'file_id',
            'dependency_id',
            'date_since',
            'date_until',
        ]);

        $movements = MovementFile::with(['file', 'dependency'])
            ->filter($filters)
            ->search($search)
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString()
            ->through(function ($movement) {
                return [
                    ...$movement->toArray(),
                    'file_name' => $movement->file ? $movement->file->name : 'No tiene',
                    'dependency_abbreviation' => $movement->dependency ? $movement->dependency->abbreviation : 'No tiene',
                ];
            });

        return Inertia::render('admin/documents/movements/index', [
            'movements' => $movements,
            'search' => $search,
            'filters' => $filters,
            'sort' => $sort,
            'direction' => $direction,
            'files' => File::getOptions(),
            'dependencies' => Dependency::getOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/documents/movements/create', [
            'files' => File::getOptions(),
            'dependencies' => Dependency::getOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovementFileRequest $request)
    {
        $validated = $request->validated();
        try {
            MovementFile::create($validated);

            return redirect()->route('documents.movements.index')
                ->with('toast', ['type' => 'success', 'message' => 'Movimiento creado correctamente']);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al crear el movimiento: ' . $e->getMessage()]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(MovementFile $movementFile)
    {
        return Inertia::render('admin/documents/movements/show', [
            'movementFile' => $movementFile,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MovementFile $movementFile)
    {
        return Inertia::render('admin/documents/movements/edit', [
            'movementFile' => $movementFile,
            'files' => File::getOptions(),
            'dependencies' => Dependency::getOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovementFileRequest $request, MovementFile $movementFile)
    {
        $validated = $request->validated();
        try {
            $movementFile->update($validated);

            return redirect()->route('documents.movements.index')
                ->with('toast', ['type' => 'success', 'message' => 'Movimiento actualizado correctamente']);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar el movimiento: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MovementFile $movementFile)
    {
        try {
            $movementFile->delete();

            return redirect()->route('documents.movements.index')
                ->with('toast', ['type' => 'success', 'message' => 'Movimiento eliminado correctamente']);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar el movimiento: ' . $e->getMessage()]);
        }
    }
}
