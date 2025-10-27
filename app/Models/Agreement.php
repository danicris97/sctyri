<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Carbon;
use App\Enums\{
    AgreementEnum,
    AgreementRenewalEnum
};

class Agreement extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementFactory> */
    use HasFactory;
    use SoftDeletes;
    use HasUuids;

    protected $fillable = [
        'type',
        'date_signature',
        'date_end',
        'date_renewal',
        'duration',
        'type_renewal',
        'international',
        'resolution_id',
        'object',
        'summary',
        'observations',
        'status',
    ];

    protected $casts = [
        'date_signature' => 'date',
        'date_end' => 'date',
        'date_renewal' => 'date',
        'international' => 'boolean',
        'duration' => 'integer',
        'type' => AgreementEnum::class,
        'type_renewal' => AgreementRenewalEnum::class,
    ];

    protected $appends = [
        'name',
        'title',
        'formated_date_signature',
        'formated_date_end',
        'formated_date_renewal',
    ];

    /**
     * Auto save para guardar calcular fecha fin y fecha de renovacion
     */

    protected static function booted()
    {
        static::saving(function ($agreement) {
            //calcular fecha fin
            if ($agreement->date_signature && $agreement->duration) {
                $agreement->date_end = $agreement->date_signature->copy()->addMonths($agreement->duration);
            }
            //calcular fecha_renovacion_vigente
            $lastRenewal = $agreement->agreementRenewals()->latest('date_end')->first();
            $agreement->date_renewal = $lastRenewal?->date_end ?? $agreement->date_end;

            //calcular estatus
            $today = Carbon::now();

            if($agreement->date_end){
                if ($agreement->date_end < $today) {
                    if ($agreement->date_end->diffInDays($today) <= 30) {
                        $agreement->status = 'Próximo a vencer';
                    }else{
                        if ($agreement->date_renewal){
                            if ($agreement->date_renewal < $today){
                                $agreement->status = 'Renovado';
                            }else{
                                $agreement->status = 'Vencido';
                            }
                        }else{
                            $agreement->status = 'Vencido';
                        }
                    }
                }
            }
        });
    }

    /**
     * Relaciones Eloquent
    */
    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }

    public function institutions()
    {
        return $this->belongsToMany(Institution::class, 'agreement_institutions')->withTimestamps();
    }

    public function dependences()
    {
        return $this->belongsToMany(Dependency::class, 'agreement_dependences')->withTimestamps();
    }

    public function personPositions()
    {
        return $this->belongsToMany(AgreementPersonPosition::class, 'agreement_people')->withTimestamps();
    }

    public function agreementRenewals()
    {
        return $this->hasMany(AgreementRenewal::class);
    }

    public function aggrementCancellations()
    {
        return $this->hasMany(AgreementCancellation::class);
    }

    /**
     * Accesors
     */

    //nommbre util para selects y otros
    public function getNameAttribute() : string
    {
        $institutions_name = '';
        foreach ($this->institutions as $institution) {
            $institutions_name .= $institution->name . ' - ';
        }

        return $institutions_name . $this->type . ' - ' . $this->date_signature->format('d-m-Y');
    }

    //titulo estandar para los convenios
    public function getTitleAttribute() : string
    {
        $institutions_name = '';
        foreach ($this->institutions as $institution) {
            $institutions_name .= $institution->name . ', ';
        }

        $dependences_name = '';
        foreach ($this->dependences as $dependency) {
            $dependences_name .= $dependency->name . ', ';
        }

        $title = '';

        if($dependences_name != '') {
           $title = $this->type . ' entre ' . $institutions_name . 'y la Universidad Nacional de Salta a traves de ' . $dependences_name . $this->date_signature->format('d-m-Y');
        }else{
            $title = $this->type . ' entre ' . $institutions_name . 'y la Universidad Nacional de Salta ' . $this->date_signature->format('d-m-Y');
        }

        return $title;
    }

    public function getRouteKeyName() : string
    {
        return 'uuid';
    }

    public function getFormatedDateSignatureAttribute() : string
    {
        return $this->date_signature->format('d-m-Y');
    }

    public function getFormatedDateEndAttribute() : string
    {
        return $this->date_end->format('d-m-Y');
    }

    public function getFormatedDateRenewalAttribute() : string
    {
        return $this->date_renewal->format('d-m-Y');
    }

    /**
     * Scopes
     */

    //scope para buscar
    public function scopeSearch($query, $search)
    {
        return $query->where('type', 'like', "%{$search}%")
            ->orWhere('date_signature', 'like', "%{$search}%")
            ->orWhere('date_end', 'like', "%{$search}%")
            ->orWhere('date_renewal', 'like', "%{$search}%")
            ->orWhereHas('resolution', function($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhereHas('file', function($q) use ($search) {
                        $q->where('number', 'like', "%{$search}%")
                            ->orWhere('year', 'like', "%{$search}%");
                    });
            })
            ->orWhereHas('institutions', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orWhereHas('dependences', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
    }

    //filtros para el dialogo
    public function scopeFilter($query, array $filters){
        if(!empty($filters['file_id'])){
            $query->whereHas('resolution', function($q) use ($filters) {
                $q->where('file_id', $filters['file_id']);
            });
        }
        
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        if (!empty($filters['institution_id'])) {
            $query->whereHas('institutions', function($q) use ($filters) {
                $q->where('institution_id', $filters['institution_id']);
            });
        }

        if (!empty($filters['dependence_id'])) {
            $query->whereHas('dependences', function($q) use ($filters) {
                $q->where('dependence_id', $filters['dependence_id']);
            });
        }
        
        if (!empty($filters['type_renewal'])) {
            $query->where('type_renewal', $filters['type_renewal']);
        }

        if (array_key_exists('international', $filters) && $filters['international'] !== null) {
            $val = $filters['international'];

            // convertir string a boolean
            if (is_string($val)) {
                $v = mb_strtolower($val);
                $val = match ($v) {
                    'true', '1', 'si', 'sí' => true,
                    'false', '0', 'no' => false,
                    default => null,
                };
            }

            if ($val !== null) {
                $query->where('international', $val);
            }
        }
        
        if (!empty($filters['date_since']) && !empty($filters['date_until'])) {
            $query->whereBetween('date_signature', [$filters['date_since'], $filters['date_until']]);
        } elseif (!empty($filters['date_since'])) {
            $query->whereBetween('date_signature', [$filters['date_since'], now()]);
        } elseif (!empty($filters['date_until'])) {
            $query->whereBetween('date_signature', ['1900-01-01', $filters['date_until']]);
        }

        if (!empty($filters['person_position_id'])) {
            $query->whereHas('personPositions', function($q) use ($filters) {
                $q->where('person_position_id', $filters['person_position_id']);
            });
        }
    }

    public function scopeActives($query)
    {
        return $query
            ->whereDoesntHave('agreementCancellations')
            ->where(function($q) {
                $q
                ->whereDate('date_end', '>=', now())
                ->orWhereHas('agreementRenewal', function($r) {
                    $r->whereDate('date_end', '>=', now());
                });
            });
    }

    public function scopeInternationals($query)
    {
        return $query->where('international', true);
    }

    public function scopeLastSemester($query)
    {
        $today = now();
        $currentYear = $today->year;

        if ($today->month >= 1 && $today->month <= 6) {
            // estamos en primer semestre del año => tomar semestre 2 del año anterior
            $since = now()->setDate($currentYear - 1, 7, 1)->startOfDay();
            $until = now()->setDate($currentYear - 1, 12, 31)->endOfDay();
        } else {
            // estamos en segundo semestre => tomar semestre 1 del año actual
            $since = now()->setDate($currentYear, 1, 1)->startOfDay();
            $until = now()->setDate($currentYear, 6, 30)->endOfDay();
        }

        return $query->whereBetween('date_signature', [$since, $until]);
    }


    public function scopeCurrents($query)
    {
        return $query->whereDate('date_end', '>=', today())
            ->orWhereHas('agreementsRenewal', function($r) {
                $r->whereDate('date_end', '>=', today());
            });
    }

    /**
     * Métodos estáticos
     */
    //opcion para selects
    public static function getOptions()
    {
        return self::all()->map(function ($agreement) {
            return [
                'value' => $agreement->id,
                'label' => $agreement->name,
            ];
        });
    }
}
