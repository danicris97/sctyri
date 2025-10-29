<?php

namespace App\Http\Controllers\Admin\Agreements;

use App\Models\{
    Agreement,
    Institution,
    Dependency,
    Person,
    PersonPosition,
    Resolution,
    File
};
use App\Http\Requests\Admin\Agreements\StoreAgreementRequest;
use App\Http\Requests\Admin\Agreements\UpdateAgreementRequest;
use App\Http\Controllers\Controller;
use App\Enums\{
    AgreementEnum,
    AgreementRenewalEnum,
    ResolutionEnum,
    InstitutionEnum,
    DependencyEnum,
    PersonPositionEnum,
    FileEnum
};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Actions\Agreements\{
    CreateAgreement,
    EditAgreement
};
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\Agreements\AgreementExportExcel;
use Maatwebsite\Excel\Exceptions\LaravelExcelException;

class AgreementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {   
        //evita fuga de informacion sensible
        $validSorts = [
            'type' => 'type',
            'date_signature' => 'date_signature',
            'date_end' => 'date_end',
            'type_renewal' => 'type_renewal',
            'resolution_number' => 'resolution.number',
            'resolution_name' => 'resolution.name',
            'file_number' => 'resolution.file.number',
            'file_year' => 'resolution.file.year',
            'date_renewal' => 'date_renewal',
            //consulta compleja para n*m
            'intitution_name' => Intitution::select('name')
                                        ->join('agreement_institutions', 'institutions.id', '=', 'agreement_institutions.institution_id')
                                        ->whereColumn('agreement.id', 'agreement_institutions.agreement_id')
                                        ->limit(1),
            'dependency_name' => Dependency::select('name')
                                    ->join('agreement_dependencies', 'dependency.id', '=', 'agreement_dependencies.dependency_id')
                                    ->whereColumn('agreement.id', 'agreement_dependencies.agreement_id')
                                    ->limit(1),
        ];

        //para hacer una query segun los parametros
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        //forma mas linda de validar parametros
        $sort = in_array($sort, $validSorts, true) ? $sort : 'date_signature';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        //filtrar los datos usando el scope filter del modelo
        $filters = $request->only([
            'search',
            'file_number',
            'file_id',
            'type',
            'institution_id',
            'international',
            'person_position_id',
            'date_since',
            'date_until',
            'dependency_id',
            'type_renewal',
        ]);

        $agreements = Agreement::with([
                'institutions', 
                'dependencies', 
                'personPositions.person', 
                'resolution.file.dependency',
                'agreementRenewals', 
                'agreementCancellations',
            ])->search($filters['search'] ?? null)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->through(function ($agreement) {
                $resolution = $agreement->resolution;
                $file = $resolution?->file;

                return [
                    //todos los campos de la tabla agreement
                    ...$agreement->toArray(),
                    'file' => $file ?? null,
                    'resolution' => $resolution ?? null,
                    //texto formateado listo para usar
                    'resolution_text' => $resolution
                        ? $resolution->name
                        : 'SIN RESOLUCIÓN',
                    'file_text' => $file
                        ? $file->name
                        : 'SIN file',
                ];
            });
        
        //query para stats
        $count_agreements = Agreement::count();
        $count_actives = Agreement::actives()->count();
        $count_last_semester = Agreement::lastSemester()->count();
        $count_international = Agreement::internationals()->count();
        $last_date = Agreement::latest()->value('created_at');

        return Inertia::render('admin/agreements/agreements/index', [
            'agreements' => $agreements,
            'search' => $search,
            'sort' => $sort,
            'direction' => $direction,
            'filters' => $filters,
            'type' => AgreementEnum::options(),
            'institutions' => Institution::getOptions(),
            'dependencies' => Dependency::getOptions(),
            'personPositions' => PersonPosition::getNoAlumnosOptions(),
            'files' => File::getOptions(),
            'types_renewal' => AgreementRenewalEnum::options(),
            'stats' => [
                'count_agreements' => $count_agreements,
                'count_actives' => $count_actives,  
                'count_last_semester' => $count_last_semester,
                'count_international' => $count_international,
                'last_date' => $last_date ? optional($last_date)->format('d/m/Y') : 'N/A',
                'percentage_actives' => $count_agreements > 0 ? round(($count_actives * 100) / $count_agreements) : 0,
                'percentage_semester' => $count_agreements > 0 ? round(($count_last_semester * 100) / $count_agreements) : 0,
                'percentage_international' => $count_agreements > 0 ? round(($count_international * 100) / $count_agreements) : 0,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/agreements/agreements/create', [
            'types' => AgreementEnum::options(),
            'resolution_types' => ResolutionEnum::options(),
            'institutions' => Institution::getOptions(),
            'institution_types' => InstitutionEnum::options(),
            'dependencies' => Dependency::getOptions(),
            'dependency_types' => DependencyEnum::options(),
            'personPositions' => PersonPosition::getOptionsNoStudent(),
            'files' => File::getOptions(),
            'file_types' => FileEnum::options(),
            'persons' => Person::getOptions(),
            'positions' => PersonPositionEnum::options(),
            'renewal_types' => AgreementRenewalEnum::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAgreementRequest $request, CreateAgreement $createAgreement)
    {
        $validated = $request->validated();

        try {
            $createAgreement($validated);

            return redirect()
                ->route('agreements.agreements.index')
                ->with('toast', [
                    'type'    => 'success',
                    'message' => 'Convenio creado correctamente'
                ]);

        } catch (\Throwable $e) {
            Log::error('Error al crear convenio', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('toast', [
                    'type'    => 'error',
                    'message' => 'Error al crear el convenio: '.$e->getMessage(),
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Agreement $agreement)
    {
        $agreement->load([
            'institutions',
            'dependencies',
            'personPositions.person',
            'resolution.file.dependency',
            'agreementRenewals',
            'agreementCancellations',
        ]);

        $resolution = $agreement->resolution;
        $file = $resolution?->file;

        $agreement->setRelation('resolution', $resolution);

        return Inertia::render('admin/agreements/agreements/show', [
            'agreement' => $agreement,
            'file' => $file,
            'resolution' => $resolution,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agreement $agreement)
    {
        $agreement->load([
            'institutions',
            'dependencies',
            'personPositions.person',
            'resolution.file.dependency',
            'agreementRenewals',
            'agreementCancellations',
        ]);

        $resolution = $agreement->resolution;
        $file = $resolution?->file;

        $agreement->setRelation('resolution', $resolution);

        return Inertia::render('admin/agreements/agreements/edit', [
            'agreement' => $agreement,
            'file' => $file,
            'resolution' => $resolution,
            'types' => AgreementEnum::options(),
            'institutions' => Institution::getOptions(),
            'institution_types' => InstitutionEnum::options(),
            'dependencies' => Dependency::getOptions(),
            'dependency_types' => DependencyEnum::options(),
            'personPositions' => PersonPostion::getOptionsNoStudent(),
            'resolutions' => Resolution::getOptions(),
            'persons' => Person::getOptionsDni(),
            'positions' => PersonPositionEnum::options(),
            'agreementRenewal_types' => AgreementRenewalEnum::options(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgreementRequest $request, Agreement $agreement, EditAgreement $editAgreement)
    {
        $validated = $request->validated();

        try {
            $editAgreement($agreement, $validated);

            return redirect()
                ->route('agreements.agreements.index')
                ->with('toast', [
                    'type'    => 'success',
                    'message' => 'Convenio actualizado correctamente'
                ]);

        } catch (\Throwable $e) {
            Log::error("Error al actualizar convenio", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('toast', [
                    'type'    => 'error',
                    'message' => 'Error al actualizar el convenio: '.$e->getMessage(),
                ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agreement $agreement)
    {
        DB::beginTransaction();

        try{
            $convenio->delete();
            DB::commit();
            return redirect()->route('agreements.agreements.index')
                ->with('toast', ['type' => 'success', 'message' => 'Convenio eliminado correctamente']);
        }catch(\Exception $e){
            DB::rollBack();
            return redirect()->back()->with('toast', ['type' => 'error', 'message' => 'Error al eliminar el convenio: ' . $e->getMessage()]);
        }
    }

    public function exportExcel(Request $request)
    {
        try {
            $validSorts = ['type','title','date_signature','date_end','type_renewal','international','resolution_id'];
            $sort = $request->get('sort', 'date_signature');
            $direction = $request->get('direction', 'desc');
            
            if (!in_array($sort, $validSorts)) $sort = 'date_signature';
            if (!in_array($direction, ['asc','desc'])) $direction = 'desc';
    
            $filters = $request->all();
            
            // Verificar que hay datos
            $query = Agreement::with(['institutions','dependencies','resolution','agreementRenewals','agreementCancellations']);
            if (method_exists(Agreement::class, 'filter')) {
                $query = $query->filter($filters);
            }
            $count = $query->count();
            
            if ($count === 0) {
                return response()->json(['message' => 'No hay datos para exportar'], 404);
            }
    
            $filename = 'convenios_'.now()->format('Ymd_His').'.xlsx';
            
            $export = new AgreementExportExcel($filters, $sort, $direction);
            
            if (ob_get_level()) {
                ob_end_clean();
            }
            
            $response = Excel::download($export, $filename);
            
            return $response;
            
        } catch (LaravelExcelException $e) {
            return response()->json([
                'error' => 'Error específico de Excel',
                'message' => $e->getMessage()
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al generar el archivo',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
