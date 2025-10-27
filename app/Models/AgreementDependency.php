<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgreementDependence extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementDependenceFactory> */
    use HasFactory;

    protected $fillable = [
        'agreement_id',
        'dependence_id',
    ];

    public function agreement()
    {
        return $this->belongsTo(Agreement::class);
    }

    public function dependence()
    {
        return $this->belongsTo(Dependence::class);
    }
}
