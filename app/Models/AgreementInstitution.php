<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgreementInstitution extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementInstitutionFactory> */
    use HasFactory;

    protected $fillable = [
        'agreement_id',
        'institution_id',
    ];

    public function agreement()
    {
        return $this->belongsTo(Agreement::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
