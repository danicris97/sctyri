<?php

namespace App\Actions\Agreements;

use App\Models\Agreement;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateAgreement
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function __invoke(array $validated): Agreement
    {
        return DB::transaction(function () use ($validated) {

            // 1. Resolver/crear/actualizar resolución
            $resolutionId = app(ResolveResolution::class)(
                $validated['resolution'] ?? null
            );

            // fallback si vino resolucion_id directo
            if (!$resolutionId && array_key_exists('resolution_id', $validated)) {
                $resolutionId = $validated['resolution_id'];
            }

            // 2. Crear convenio principal
            $agreement = Agreement::create([
                'type'   => $validated['type'],
                'date_signature'     => $validated['date_signature'],
                'duration'        => $validated['duration'] ?? null,
                'type_renewal' => $validated['type_renewal'] ?? null,
                'international'   => $validated['international'] ?? false,
                'resolucion_id'   => $resolutionId,
                'object'          => $validated['object'] ?? null,
                'observations'   => $validated['observations'] ?? null,
                'summary'        => $validated['summary'] ?? null,
            ]);

            // 3. Relacionar instituciones
            $agreement->institutions()->sync(
                collect($validated['institutions'] ?? [])->pluck('id')
            );

            // 4. Relacionar dependencias UNSA
            $agreement->dependencies()->sync(
                collect($validated['dependencies'] ?? [])->pluck('id')
            );

            // 5. Relacionar firmantes UNSA
            $agreement->personPositions()->sync(
                collect($validated['personPositions'] ?? [])->pluck('id')
            );

            return $agreement;
        });
    }
}
