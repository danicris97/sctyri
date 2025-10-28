<?php

namespace App\Actions\Entities;

use App\Models\Province;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ResolveProvince
{
    public function __invoke(string $name, int $countryId): int
    {
        $trimmedName = trim($name);

        if ($trimmedName === '') {
            throw new InvalidArgumentException('El nombre de la provincia no puede estar vacio.');
        }

        return DB::transaction(function () use ($countryId, $trimmedName) {
            $existing = Province::where('country_id', $countryId)
                ->where('name', $trimmedName)
                ->first();

            if ($existing) {
                return (int) $existing->getKey();
            }

            return (int) Province::create([
                'country_id' => $countryId,
                'name' => $trimmedName,
            ])->getKey();
        });
    }
}
