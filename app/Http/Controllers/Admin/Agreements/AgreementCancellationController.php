<?php

namespace App\Http\Controllers\Admin\Agreements;

use App\Models\{
    AgreementCancellation,
    Agreement,
    Resolution,
    File,
    Institution,
    Dependency
};
use App\Http\Requests\Admin\Agreements\StoreAgreementCancellationRequest;
use App\Http\Requests\Admin\Agreements\UpdateAgreementCancellationRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\ResolutionEnum;
use App\Domain\Agreements\AgreementService;

class AgreementCancellationController extends Controller
{
    protected AgreementService $agreementService;

    public function __construct(AgreementService $agreementService)
    {
        $this->agreementService = $agreementService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validSorts = ['date_cancellation','reason'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');
        $filters = $request->only([
            'date_since', 
            'date_until',
            'agreement_id',
            'resolution_id',
            'institution_id',
            'dependency_id',
        ]);

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $agreementCancellations = AgreementCancellation::with('agreement', 'resolution.file.dependency')
                                ->search($search)
                                ->filter($filters)
                                ->orderBy($sort, $direction)
                                ->paginate(10)
                                ->withQueryString()
                                ->through(function ($agreementCancellation) {
                                    $resolution = $agreementCancellation->resolution;
                                    $file = $agreementCancellation->agreement->file ?? $resolution?->file;

                                    return [
                                        ...$agreementCancellation->toArray(),
                                        'agreement_name' => $agreementCancellation->agreement?->name,
                                        'formated_cancellation_date' => $agreementCancellation->formated_cancellation_date,
                                        'resolution_name' => $resolution ? $resolution->name : 'SIN RESOLUCIÓN',
                                        'file_name' => $file ? $file->name : 'SIN EXPEDIENTE',
                                    ];
        });

        //stats
        $last_cancellations = AgreementCancellation::whereHas('agreement', function($q) {
            $q->whereDate('cancellation_date', '>=', now()->subDays(30));
        })->count();

        $count_cancellations = AgreementCancellation::count();

        $last_date = AgreementCancellation::latest()->value('cancellation_date');

        return Inertia::render('admin/agreements/agreement-cancellations/index', [
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'stats' => [
                'last_cancellations' => $last_cancellations,
                'count_cancellations' => $count_cancellations,
                'last_date' => $last_date,
            ],
            'agreementCancellations' => $agreementCancellations,
            'agreements' => Agreement::getOptions(),
            'resolutions' => Resolution::getOptions(),
            'files' => File::getOptions(),
            'institutions' => Institution::getOptions(),
            'dependencies' => Dependency::getOptions()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/agreements/agreement-cancellations/create', [
            'agreements' => Agreement::getOptionsWithOutCancelled(),
            'resolutions' => Resolution::getOptions(),
            'files' => File::getOptions(),
            'institutions' => Institution::getOptions(),
            'dependencies' => Dependency::getOptions()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAgreementCancellationRequest $request)
    {
        $validated = $request->validated();

        try {
            $agreement = Agreement::findOrFail($validated['agreement_id']);
            $this->agreementService->cancel($agreement, $validated);

            return redirect()
                ->route('agreements.cancellations.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Baja de convenio creada correctamente',
                ]);
        } catch (\DomainException $e) {
            return redirect()->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => $e->getMessage()
                ]);
        } catch (\Exception $e) {
            \Log::error('Error al crear la baja de convenio.', [
                'exception' => $e,
            ]);

            return redirect()->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error al crear la baja de convenio: ' . $e->getMessage(),
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AgreementCancellation $agreementCancellation)
    {
        return Inertia::render('admin/agreements/agreement-cancellations/show', [
            'agreementCancellation' => $agreementCancellation,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AgreementCancellation $agreementCancellation)
    {
        return Inertia::render('admin/agreements/agreement-cancellations/edit', [
            'agreementCancellation' => $agreementCancellation,
            'agreements' => Agreement::getOptionsWithOutCancelled(),
            'agreement_name' => $agreementCancellation->agreement?->name,
            'resolutions' => Resolution::getOptions(),
            'resolutions_type' => ResolutionEnum::Options(),
            'files' => File::getOptions()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgreementCancellationRequest $request, AgreementCancellation $agreementCancellation)
    {
        $validated = $request->validated();
        $agreementCancellation->agreement->syncStatus();

        try{
            $agreementCancellation->update($validated);
            return redirect()->route('agreements.cancellations.index')
                ->with('toast', ['type' => 'success', 'message' => 'Baja de convenio actualizada correctamente']);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar la baja de convenio.', [
                'exception' => $e,
            ]);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la baja de convenio: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AgreementCancellation $agreementCancellation)
    {
        try {
            $agreement = $agreementCancellation->agreement;
            $agreementCancellation->delete();
            $agreement->syncStatus();
            
            return redirect()->route('agreements.cancellations.index')
                ->with('toast', ['type' => 'success', 'message' => 'Baja de convenio eliminada correctamente']);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar la baja de convenio.', [
                'exception' => $e,
            ]);
            return redirect()->route('agreements.cancellations.index')
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar la baja de convenio: ' . $e->getMessage()]);
        }
    }
}
