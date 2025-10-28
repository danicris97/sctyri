<?php

namespace App\Http\Controllers\Admin\Documents;

use App\Models\{
    File, 
    Dependency, 
    Institution, 
    Person
};
use App\Http\Requests\Admin\Documents\StoreFileRequest;
use App\Http\Requests\Admin\Documents\UpdateFileRequest;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Enums\{
    FileEnum,
    DependencyEnum,
    InstitutionEnum,
    PersonPositionEnum
};

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = [
            'number',
            'year',
            'dependency',
        ];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only([
            'year', 
            'type', 
            'dependency_id',
            'causative_dependency_id',
            'causative_person_id',
            'causative_institution_id',
        ]);

        $files = File::with('dependency', 'resolutions', 'movements', 'causative')
            ->search($search)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->through(fn($file) => [
                ...$file->toArray(),
                'dependency' => $file->dependency ? $file->dependency->abbreviation : 'No tiene',
                'causative' => $file->causative ? $file->causative_name : 'No tiene',
                'opening_date' => $file->opening_date ? $file->formated_opening_date : 'No tiene',
                'closing_date' => $file->closing_date ? $file->formated_closing_date : 'No tiene',
            ]);

        return Inertia::render('admin/documents/files/index', [
            'files' => $files,
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'filters' => $filters,
            'types' => FileEnum::options(),
            'types_dependencies' => DependencyEnum::options(),
            'dependencies' => Dependency::getOptions(),
            'types_institutions' => InstitutionEnum::options(),
            'institutions'=> Institution::getOptions(),
            'persons' => Person::getOptions(),
            'positions' => PersonPositionEnum::options(),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/documents/files/create', [
            'types' => FileEnum::options(),
            'types_dependencies' => DependencyEnum::options(),
            'dependencies' => Dependency::getOptions(),
            'types_institutions' => InstitutionEnum::options(),
            'institutions'=> Institution::getOptions(),
            'persons' => Person::getOptions(),
            'positions' => PersonPositionEnum::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFileRequest $request)
    {
        $validated = $request->validated();

        try {
            $file = File::create($validated);

            // Si la request quiere JSON (por fetch/AJAX o Inertia visit con XHR)
            if ($request->expectsJson()) {
                return response()
                    ->json($file);
            }

            // Flujo normal: redirigir al index
            return redirect()
                ->route('documents.files.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Expediente creado correctamente'
                ]);

        } catch (\Exception $e) {
            \Log::error('Error al crear expediente', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Error al crear el expediente: ' . $e->getMessage()
                ], 500);
            }

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error al crear el expediente: ' . $e->getMessage()
                ]);
        }

    }
    /**
     * Display the specified resource.
     */
    public function show(File $file)
    {
        return Inertia::render('admin/documents/files/show', [
            'file' => $file,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(File $file)
    {
        return Inertia::render('admin/documents/files/edit', [
            'file' => $file,
            'types' => FileEnum::options(),
            'types_dependencies' => DependencyEnum::options(),
            'dependencies' => Dependency::getOptions(),
            'types_institutions' => InstitutionEnum::options(),
            'institutions'=> Institution::getOptions(),
            'persons' => Person::getOptions(),
            'positions' => PersonPositionEnum::options(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFileRequest $request, File $file)
     {
        $validated = $request->validated();
        try{
            $file->update($validated);
            return redirect()->route('documents.files.index')
                ->with('toast', ['type' => 'success', 'message' => 'Expediente actualizado correctamente']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar el expediente: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file)
    {
        try {
            $file->delete();
            return redirect()->route('documents.files.index')
                ->with('toast', ['type' => 'success', 'message' => 'Expediente eliminado correctamente']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar el expediente: ' . $e->getMessage()]);
        }
    }
}
