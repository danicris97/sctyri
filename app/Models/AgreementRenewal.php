<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class AgreementRenewal extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementRenewalFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'start_date',
        'duration',
        'end_date',
        'observations',
        'agreement_id',
        'resolution_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = [
        'formated_start_date',
        'formated_end_date',
    ];

    /**
     * Scopes
     */

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($builder) use ($search) {
                $likeSearch = '%' . $search . '%';

                $builder->where('start_date', 'like', $likeSearch)
                    ->orWhere('duration', 'like', $likeSearch)
                    ->orWhere('observations', 'like', $likeSearch)
                    ->orWhere('end_date', 'like', $likeSearch)
                    ->orWhereHas('agreement', function ($agreementQuery) use ($likeSearch) {
                        $agreementQuery->where('summary', 'like', $likeSearch)
                            ->orWhere('type', 'like', $likeSearch)
                            ->orWhereHas('resolution.file', function ($fileQuery) use ($likeSearch) {
                                $fileQuery->where('number', 'like', $likeSearch)
                                    ->orWhere('year', 'like', $likeSearch);
                            });
                    })
                    ->orWhereHas('resolution', function ($resolutionQuery) use ($likeSearch) {
                        $resolutionQuery->where('number', 'like', $likeSearch)
                            ->orWhere('type', 'like', $likeSearch);
                    });
            });
    }

    public function scopeFilter($query, $filters)
    {
        if ($filters['date_since'] && $filters['date_until']) {
            $query->whereBetween('start_date', [$filters['date_since'], $filters['date_until']]);
        } elseif ($filters['date_since']) {
            $query->whereBetween('start_date', [$filters['date_since'], now()->toDateString()]);
        } elseif ($filters['date_until']) {
            $query->whereBetween('start_date', ['1900-01-01', $filters['date_until']]);
        }

        if ($filters['agreement_id']) {
            $query->where('agreement_id', $filters['agreement_id']);
        }

        if ($filters['file_id']) {
            $query->whereHas('file', function ($q) use ($filters) {
                $q->where('id', $filters['file_id']);
            });
        }

        if ($filters['institution_id']) {
            $query->whereHas('agreement', function ($q) use ($filters) {
                $q->where('institution_id', $filters['institution_id']);
            });
        }
        
        if ($filters['dependency_id']) {
            $query->whereHas('agreement', function ($q) use ($filters) {
                $q->where('dependency_id', $filters['dependency_id']);
            });
        }

        if ($filters['type']) {
            $query->whereHas('agreement', function ($q) use ($filters) {
                $q->where('type', $filters['type']);
            });
        }
    }

    /**
     * Accessors
     */
    public function getFormatedStartDateAttribute(): ?string
    {
        return $this->start_date ? Carbon::parse($this->start_date)->format('d/m/Y') : null;
    }

    public function getFormatedEndDateAttribute(): ?string
    {
        return $this->end_date ? Carbon::parse($this->end_date)->format('d/m/Y') : null;
    }

    /**
     * Auto save para calcular la fecha de finalización
     */

    protected static function booted()
    {
        static::saving(function ($renewal) {
            if ($renewal->start_date && $renewal->duration) {
                $start_date = $renewal->start_date instanceof Carbon
                    ? $renewal->start_date->copy()
                    : Carbon::parse($renewal->start_date);

                $renewal->end_date = $start_date->addMonths((int) $renewal->duration);
            }
        });
    }
    
    /**
     * Relaciones Eloquent
     */

    public function agreement()
    {
        return $this->belongsTo(Agreement::class);
    }

    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }
}
