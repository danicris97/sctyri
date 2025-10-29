<?php

namespace App\Actions\Agreements;

use App\Models\Agreement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EditAgreement
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function __invoke(Agreement $agreement, array $validated): Agreement
    {
        return DB::transaction(function () use ($agreement, $validated) {

            // 1. Resolver/actualizar resolución
            $resolutionId = app(ResolveResolucion::class)(
                $validated['resolution'] ?? null
            );

            if (!$resolutionId && array_key_exists('resolution_id', $validated)) {
                $resolutionId = $validated['resolution_id'];
            }

            // Si no vino nada nuevo y tampoco resolucion_id explícito,
            // mantené la resolución actual
            if ($resolutionId === null
                && !array_key_exists('resolution_id', $validated)
                && empty($validated['resolution'] ?? [])
            ) {
                $resolutionId = $agreement->resolution_id;
            }

            // 3. Actualizar datos principales del convenio
            $agreement->update([
                'type'   => $validated['type'],
                'date_signature'     => $validated['date_signature'],
                'date_end'       => $validated['date_end'] ?? null,
                'type_renewal' => $validated['type_renewal'] ?? null,
                'international'   => $validated['international'] ?? false,
                'duration'        => $validated['duration'] ?? null,
                'object'          => $validated['object'] ?? null,
                'resolution_id'   => $resolutionId,
                'observations'   => $validated['observations'] ?? null,
                'summary'        => $validated['summary'] ?? null,
            ]);

            // 4. Sync relaciones many-to-many
            $agreement->institutions()->sync(
                collect($validated['institutions'] ?? [])->pluck('id')
            );

            $agreement->dependencies()->sync(
                collect($validated['dependencies'] ?? [])->pluck('id')
            );

            $agreement->personPositions()->sync(
                collect($validated['personPositions'] ?? [])->pluck('id')
            );

            return $agreement;
        });
    }
}
