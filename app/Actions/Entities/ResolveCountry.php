<?php

namespace App\Actions\Entities;

use App\Models\Country;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ResolveCountry
{
    public function __invoke(string $name): int
    {
        $trimmedName = trim($name);

        if ($trimmedName === '') {
            throw new InvalidArgumentException('El nombre del pais no puede estar vacio.');
        }

        return DB::transaction(function () use ($trimmedName) {
            $existing = Country::where('name', $trimmedName)->first();

            if ($existing) {
                return (int) $existing->getKey();
            }

            return (int) Country::create([
                'name' => $trimmedName,
            ])->getKey();
        });
    }
}
