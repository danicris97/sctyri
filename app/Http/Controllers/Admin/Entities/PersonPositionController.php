<?php

namespace App\Http\Controllers\Admin\Entities;

use App\Models\{
    PersonPosition,
    Person,
};
use App\Http\Requests\Admin\Entities\StorePersonPositionRequest;
use App\Http\Requests\Admin\Entities\UpdatePersonPositionRequest;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Enums\PersonPositionEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Actions\Entities\{
    CreatePersonPosition,
    UpdatePersonPosition,
};

class PersonPositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = ['name', 'surname', 'dni', 'position', 'created_at'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = trim((string) $request->get('search', ''));

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $filters = $request->only(['position', 'active']);
        
        $personPosition = PersonPosition::with([
            'person',
            ])->search($filters['search'] ?? $search)
            ->filter($filters)
            ->ordered($sort, $direction)
            ->paginate(10)
            ->withQueryString()
            ->through(function (PersonPosition $personPosition) {
                return [
                    ...$personPosition->toArray(),
                    'person' => $personPosition->person,
                ];
        });

        return Inertia::render('admin/entities/person-position/index', [
            'person_positions' => $personPositions,
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'filters' => [
                'position' => $request->get('position', ''),
            ],
            'positions' => PersonPositionEnum::options(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {   
        return Inertia::render('admin/entities/person-position/create', [
            'persons' => Person::getOptions(),
            'positions' => PersonPositionEnum::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePersonPositionRequest $request, CreatePersonPosition $createPersonPosition)
    {
        try {
            $personPosition = $createPersonPosition($request->validated());

            if ($request->expectsJson()) {
                return response()->json([
                    'toast' => ['type' => 'success', 'message' => 'Persona con cargo creada correctamente'],
                    'person_position' => $personPosition->load('person')->toArray(),
                ], 201);
            }

            return redirect()->route('admin.person-position.index')
                ->with('toast', ['type' => 'success', 'message' => 'Persona con cargo creada correctamente']);
        } catch (\Throwable $exception) {
            Log::error('Error al crear la Persona con cargo.', [
                'exception' => $exception,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'toast' => ['type' => 'error', 'message' => 'Error al crear la Persona con cargo. Por favor, intente de nuevo.'],
                ], 500);
            }

            return redirect()->back()
                ->withInput()
                ->with('toast', ['type' => 'error', 'message' => 'Error al crear la Persona con cargo. Por favor, intente de nuevo.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PersonPosition $personPosition)
    {
        return Inertia::render('admin/person-position/show', [
            'person_position' => $person_position,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PersonPosition $personPosition)
    {
        return Inertia::render('admin/person-position/edit', [
            'person_position' => $person_position,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePersonPositionRequest $request, PersonPosition $personPosition, UpdatePersonPosition $updatePersonPosition)
    {
        try {
            $personPosition = $updatePersonPosition($request->validated());

            if ($request->expectsJson()) {
                return response()->json([
                    'toast' => ['type' => 'success', 'message' => 'Persona con cargo actualizada correctamente'],
                    'person_position' => $personPosition->load('person')->toArray(),
                ], 201);
            }

            return redirect()->route('admin.person-position.index')
                ->with('toast', ['type' => 'success', 'message' => 'Persona con cargo actualizada correctamente']);
        } catch (\Throwable $exception) {
            Log::error('Error al actualizar la Persona con cargo.', [
                'exception' => $exception,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'toast' => ['type' => 'error', 'message' => 'Error al actualizar la Persona con cargo. Por favor, intente de nuevo.'],
                ], 500);
            }

            return redirect()->back()
                ->withInput()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la Persona con cargo. Por favor, intente de nuevo.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PersonPosition $personPosition)
    {
        try {
            $persona_rol->delete();
            return redirect()->route('admin.person-position.index')
                ->with('toast', ['type' => 'success', 'message' => 'Persona eliminada correctamente']);
        } catch (\Exception $e) {
            return redirect()->route('admin.person-position.index')
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar el persona: ' . $e->getMessage()]);
        }
    }
}
