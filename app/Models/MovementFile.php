<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class MovementFile extends Model
{
    /** @use HasFactory<\Database\Factories\MovementFileFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'file_id',
        'dependency_id',
        'folios',
        'date',
        'purpose',
        'observations',
    ];

    protected $appends = [
        'formated_date',
        'dependency_abbreviation'
    ];

    /**
     * Relaciones
     */
    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function dependency()
    {
        return $this->belongsTo(Dependency::class, 'dependency_id');
    }

    /**
     * Accesors
     */

    public function getFormatedDateAttribute()
    {
        return Carbon::parse($this->date)->format('d/m/Y');
    }

    public function getDependencyAbbreviationAttribute()
    {
        return $this->dependency?->abbreviation ?? '';
    }
}
