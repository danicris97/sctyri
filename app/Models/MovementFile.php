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
     * Scopes
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('folios', 'like', "%{$search}%")
                     ->orWhere('date', 'like', "%{$search}%")
                        ->orWhereHas('file', function ($fileQuery) use ($search) {
                            $fileQuery
                                ->where('number', 'like', "%{$search}%")
                                ->orWhere('year', 'like', "%{$search}%");
                        })
                        ->orWhereHas('dependency', function ($dependencyQuery) use ($search) {
                            $dependencyQuery
                                ->where('abbreviation', 'like', "%{$search}%")
                                ->orWhere('name', 'like', "%{$search}%");
                        });
    }

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['file_id'])) {
            $query->where('file_id', $filters['file_id']);
        }

        if (!empty($filters['dependency_id'])) {
            $query->where('dependency_id', $filters['dependency_id']);
        }

        if (!empty($filters['date_since']) && !empty($filters['date_until'])) {
            $query->whereBetween('date', [$filters['date_since'], $filters['date_until']]);
        } elseif (!empty($filters['date_since'])) {
            $query->whereBetween('date', [$filters['date_since'], now()]);
        } elseif (!empty($filters['date_until'])) {
            $query->whereBetween('date', ['1900-01-01', $filters['date_until']]);
        }
    }


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
