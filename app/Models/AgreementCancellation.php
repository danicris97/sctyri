<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class AgreementCancellation extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementCancellationFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'cancellation_date',
        'reason',
        'agreement_id',
        'resolution_id',
    ];

    protected $casts = [
        'cancellation_date' => 'date',
    ];

    protected $appends = [
        'formated_cancellation_date',
    ];

    /**
     * Scopes
     */

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
                $q->where('cancellation_date', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhereHas('agreement', function ($agreementQuery) use ($search) {
                        $agreementQuery->where('title', 'like', $search)
                            ->orWhere('type', 'like', $search)
                            ->orWhereHas('resolution.file', function ($fileQuery) use ($search) {
                                $fileQuery->where('number', 'like', $search)
                                    ->orWhere('year', 'like', $search);
                            });
                    });
            });
        
    }

    public function scopeFilter($query, $filters)
    {
        if ($filters->filled('date_since') && $filters->filled('date_until')) {
            $query->whereBetween('cancellation_date', [$filters->date_since, $filters->date_until]);
        } elseif ($filters->filled('date_since')) {
            $query->whereBetween('cancellation_date', [$filters->date_since, now()->toDateString()]);
        } elseif ($filters->filled('date_until')) {
            $query->whereBetween('cancellation_date', ['1900-01-01', $filters->date_until]);
        }

        if ($filters->filled('agreement_id')) {
            $query->where('agreement_id', $filters->agreement_id);
        }

        if ($filters->filled('resolution_id')) {
            $query->whereHas('resolution', function ($q) use ($filters) {
                $q->where('id', $filters->resolution_id);
            });
        }

        if ($filters->filled('institution_id')) {
            $query->whereHas('agreement', function ($q) use ($filters) {
                $q->where('institution_id', $filters->institution_id);
            });
        }
        
        if ($filters->filled('dependency_id')) {
            $query->whereHas('agreement', function ($q) use ($filters) {
                $q->where('dependency_id', $filters->dependency_id);
            });
        }
    }

    /**
     * Relaciones
     */

    public function agreement()
    {
        return $this->belongsTo(Agreement::class);
    }

    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }

    //un acuerdo solo puede tener una resolucion de baja
    public function file()
    {
        return $this->hasOneThrough(
            File::class,
            Resolution::class,
            'id',
            'id',
            'resolution_id',
            'file_id' 
        );
    }

    /**
     * Accessors
     */
    public function getFormatedCancellationDateAttribute(): ?string
    {
        return $this->cancellation_date ? Carbon::parse($this->cancellation_date)->format('d/m/Y') : null;
    }
}
