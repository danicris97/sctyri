<?php

namespace App\Actions\Agreements;

use App\Models\Resoltion;
use Illuminate\Support\Arr;

class ResolveResolution
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function __invoke(?array $resolutionData): ?int
    {
        if (empty($resolutionData)) {
            return null;
        }

        // Caso 1: vino un id -> update parcial de esa resolución
        if (!empty($resolutionData['id'])) {
            $resolution = Resoltion::find($resolutionData['id']);

            if ($resolution) {
                $payload = Arr::only($resolutionData, [
                    'number',
                    'date',
                    'type',
                    'matter',
                    'link',
                    'file_id',
                ]);

                if (!empty($payload)) {
                    $resolution->update($payload);
                }

                return $resolution->id;
            }

            // si pasó un id inválido devolvemos null para no romper
            return null;
        }

        // Caso 2: no hay id pero sí datos mínimos -> crear nueva resolución
        if (!empty($resolutionData['number']) && !empty($resolutionData['date'])) {

            $payload = Arr::only($resolutionData, [
                'number',
                'date',
                'type',
                'matter',
                'link',
                'file_id',
            ]);

            $resolution = Resolution::create($payload);

            return $resolution->id;
        }

        // Caso 3: vino algo incompleto -> ignorar
        return null;
    }
}
