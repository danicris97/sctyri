<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgreementPersonPosition extends Model
{
    /** @use HasFactory<\Database\Factories\AgreementPersonPositionFactory> */
    use HasFactory;

    protected $table = 'agreement_people';

    protected $fillable = [
        'agreement_id',
        'person_position_id',
    ];

    public function agreement()
    {
        return $this->belongsTo(Agreement::class);
    }

    public function personPosition()
    {
        return $this->belongsTo(PersonPosition::class);
    }
}
