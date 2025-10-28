<?php
namespace App\Actions\Entities;

use App\Models\Locality;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ResolveLocality
{
    public function __invoke(string $name, int $provinceId): int
    {
        $trimmedName = trim($name);

        if ($trimmedName === '') {
            throw new InvalidArgumentException('El nombre de la localidad no puede estar vacio.');
        }

        return DB::transaction(function () use ($provinceId, $trimmedName) {
            $existing = Locality::where('province_id', $provinceId)
                ->where('name', $trimmedName)
                ->first();

            if ($existing) {
                return (int) $existing->getKey();
            }

            return (int) Locality::create([
                'province_id' => $provinceId,
                'name' => $trimmedName,
            ])->getKey();
        });
    }
}
