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
