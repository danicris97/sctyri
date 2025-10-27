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
