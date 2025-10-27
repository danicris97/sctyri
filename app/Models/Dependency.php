<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\DependencyEnum;

class Dependency extends Model
{
    /** @use HasFactory<\Database\Factories\DependenciesFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'abbreviation',
        'parent_dependency_id',
        'locality_id',
        'address',
        'phone',
        'email',
        'web',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'type' => DependencyEnum::class,
    ];

    /**
     * Relaciones
     */
    public function parentDependency()
    {
        return $this->belongsTo(Dependency::class, 'parent_dependency_id');
    }

    public function childrenDependency()
    {
        return $this->hasMany(Dependency::class, 'parent_dependency_id');
    }

    public function agreements()
    {
        return $this->belongsToMany(Agreement::class, 'agreement_dependencies');
    }

    public function locality()
    {
        return $this->belongsTo(Locality::class);
    }

    //de donde es el expediente
    public function files()
    {
        return $this->hasMany(File::class);
    }

    //dependencia como causante de un expediente
    public function filesCausative(): MorphMany
    {
        return $this->morphMany(File::class, 'causative');
    }

    /**
     * Scopes
     */

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
            ->orWhere('type', 'like', "%{$search}%")
            ->orWhere('abbreviation', 'like', "%{$search}%")
            ->orWhereHas('parentDependency', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['type'])) {
            $query->where('type', 'like', "%{$filters['type']}%");
        }

        if (!empty($filters['parent_dependency_id'])) {
            $query->where('parent_dependency_id', $filters['parent_dependency_id']);
        }

        if (!empty($filters['locality_id'])) {
            $query->where('locality_id', $filters['locality_id']);
        }
    }

    /**
     * Accesors y helpers
     */

    public static function getOptions($excludeId = null): array
    {
        $query = self::query()
            ->orderBy('name');

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->get()
            ->map(fn ($dependency) => [
                'value' => (string) $dependency->id,
                'label' => $dependency->abbreviation,
            ])
            ->all();
    }

    public static function getOptionFacultades(): array
    {
        return self::query()
            ->where('type', DependencyEnum::Facultad)
            ->orderBy('name')
            ->get()
            ->map(fn ($dependency) => [
                'value' => (string) $dependency->id,
                'label' => $dependency->abbreviation,
            ])
            ->all();
    }
}
