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

        $query = PersonPosition::query()
            ->with(['person' => function ($query) {
                $query->select('id', 'name', 'surname', 'dni', 'email', 'phone', 'address');
            }]);

        // Busqueda libre
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('person', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%{$search}%")
                         ->orWhere('surname', 'like', "%{$search}%")
                         ->orWhere('dni', 'like', "%{$search}%");
                })->orWhere('position', 'like', "%{$search}%");
            });
        }

        // Filtros especificos
        if ($request->filled('position')) {
            $query->where('position', 'like', '%' . $request->position . '%');
        }

        // Ordenamiento: si se ordena por campos de persona, usar subconsulta
        if (in_array($sort, ['name', 'surname', 'dni'], true)) {
            $query->orderBy(
                Person::select($sort)
                    ->whereColumn('person.id', 'person_positions.person_id'),
                $direction
            );
        } else {
            $query->orderBy($sort, $direction);
        }

        $personPositions = $query
            ->paginate(10)
            ->withQueryString()
            ->through(function (PersonPosition $personPosition) {
                $person = $personPosition->person;

                return [
                    'id' => $personPosition->id,
                    'position' => $personPosition->position,
                    'active' => (bool) $personPosition->active,
                    'created_at' => $personPosition->created_at?->toISOString(),
                    'updated_at' => $personPosition->updated_at?->toISOString(),
                    'person' => $person ? [
                        'id' => $person->id,
                        'name' => $person->name,
                        'surname' => $person->surname,
                        'dni' => $person->dni,
                        'email' => $person->email,
                        'phone' => $person->phone,
                        'address' => $person->address,
                    ] : null,
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
            'toast' => session('toast'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {   
        return Inertia::render('admin/entities/person-position/create', [
            'persons' => Person::getDropdownOptionsDni(),
            'positions' => PersonPositionEnum::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePersonPositionRequest $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(PersonPosition $personPosition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PersonPosition $personPosition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePersonPositionRequest $request, PersonPosition $personPosition)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PersonPosition $personPosition)
    {
        //
    }
}
