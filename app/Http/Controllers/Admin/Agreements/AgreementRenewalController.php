<?php

namespace App\Http\Controllers\Admin\Agreements;

use App\Models\{
    Agreement,
    AgreementRenewal,
    Resolution,
    File,
    Institution,
    Dependency,
};
use App\Http\Requests\Admin\Agreements\StoreAgreementRenewalRequest;
use App\Http\Requests\Admin\Agreements\UpdateAgreementRenewalRequest;
use App\Http\Controllers\Controller;
use App\Enums\AgreementRenewalTypeEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Agreements\AgreementService;

class AgreementRenewalController extends Controller
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
        $validSorts = ['start_date','duration','observations','type','end_date'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');
        $filters = $request->only([
            'date_since',
            'date_until',
            'agreement_id',
            'file_id',
            'institution_id',
            'dependency_id',
        ]);

        $sort = in_array($sort, $validSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';
        
        $renewals = AgreementRenewal::with([
                'agreement.resolution',
                'file.dependency',
                'resolution.file.dependency',
            ])->orderBy($sort, $direction)
            ->search($search)
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->through(function (AgreementRenewal $renewal) {
                $resolution = $renewal->resolution;
                $file = $renewal->file ?? $resolution?->file;

                return [
                    ...$renewal->toArray(),
                    'formated_start_date' => $renewal->formated_start_date ?? 'SIN FECHA',
                    'formated_end_date' => $renewal->formated_end_date ?? 'SIN FECHA',
                    'agreement_name' => $renewal->agreement?->name,
                    'resolution_name' => $resolution ? $resolution->name : 'SIN RESOLUCIÓN',
                    'file_name' => $file ? $file->name : 'SIN EXPEDIENTE',
                ];
            });

        $last_renewals = AgreementRenewal::whereDate('start_date', '>=', now()->subDays(30))->count();
        $renewals_count = AgreementRenewal::count();
        $last_date = AgreementRenewal::latest('created_at')->value('created_at');

        return Inertia::render('admin/agreements/agreement-renewals/index', [
            'renewalsAgreements' => $renewals,
            'agreements' => Agreement::getOptions(),
            'resolutions' => Resolution::getOptions(),
            'files' => File::getOptions(),
            'institutions' => Institution::getOptions(),
            'dependencies' => Dependency::getOptions(),
            'types' => AgreementRenewalTypeEnum::options(),
            'stats' => [
                'last_renewals' => $last_renewals,
                'total_renewals' => $renewals_count,
                'last_date' => $last_date,
                'institution_count' => 0,
                'international_count' => 0,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/agreements/agreement-renewals/create', [
            'agreements' => Agreement::getOptionsRenewables(),
            'resolutions' => Resolution::getOptions(),
            'resolution_types' => ResolucionEnum::options(),
            'files' => File::getOptions()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAgreementRenewalRequest $request)
    {
        $validated = $request->validated();

        try {
            $agreement = Agreement::findOrFail($validated['agreement_id']);
            $this->agreementService->renew($agreement, $validated);

            return redirect()
                ->route('agreements.agreement-renewals.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Renovación de convenio creada correctamente',
                ]);
        }catch (\DomainException $e) {
            // regla de negocio (ej: convenio cancelado)
            return redirect()->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => $e->getMessage()
                ]);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al crear la renovacion de convenio: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AgreementRenewal $agreementRenewal)
    {
        return Inertia::render('admin/agreements/agreement-renewals/show', [
            'agreementRenewal' => $agreementRenewal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AgreementRenewal $agreementRenewal)
    {
        return Inertia::render('admin/agreements/agreement-renewals/edit', [
            'agreementRenewal' => $agreementRenewal,
            'agreement_name' => $agreementRenewal->agreement?->name,
            'agreements' => Agreement::getOptionsRenewables(),
            'resolutions' => Resolution::getOptions(),
            'resolution_types' => ResolucionEnum::options(),
            'files' => File::getOptions()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgreementRenewalRequest $request, AgreementRenewal $agreementRenewal)
    {
        $validated = $request->validated();

        try {
            $agreementRenewal->update($validated);
            $agreementRenewal->agreement->syncStatus();

            return redirect()->route('agreements.agreement-renewals.index')
                ->with('toast', ['type' => 'success', 'message' => 'Renovacion de convenio actualizada correctamente']);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al actualizar la renovacion de convenio: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AgreementRenewal $agreementRenewal)
    {
        try {
            $agreement = $agreementRenewal->agreement;
            $agreementRenewal->delete();
            $agreement->syncStatus();

            return redirect()->route('agreements.agreement-renewals.index')
                ->with('toast', ['type' => 'success', 'message' => 'Renovacion de convenio eliminada correctamente']);
        } catch (\Exception $e) {
            \Log::error($e);
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => 'Error al eliminar la renovacion de convenio: ' . $e->getMessage()]);
        }
    }
}
