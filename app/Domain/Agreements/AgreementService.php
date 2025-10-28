<?php

namespace App\Domain\Agreements;

use App\Models\Agreement;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Enums\AgreementStatusEnum;

class AgreementService
{
    public function __construct()
    {
        //
    }

    /**
     * Renovar un convenio:
     * - Crea el registro de renovación (hija)
     * - Recalcula fechas y estado del convenio
     * - Devuelve el Agreement actualizado
     */
    public function renew(Agreement $agreement, array $data): Agreement
    {
        if ($agreement->status === AgreementStatusEnum::Cancelado) {
            throw new \DomainException('No se puede renovar un convenio dado de baja.');
        }

        return DB::transaction(function () use ($agreement, $data) {
            $agreement->renewals()->create([
                'agreement_id'   => $agreement->id,
                'resolution_id'  => $data['resolution_id'] ?? null,
                'start_date'     => $data['start_date'] ?? Carbon::now(),
                'duration'       => $data['duration'] ?? null,
                'end_date'       => $data['end_date'] ?? null,
                'observations'   => $data['observations'] ?? null,
            ]);

            $agreement->syncStatus();

            return $agreement->fresh();
        });
    }

    /**
     * Dar de baja (cancelar) un convenio:
     * - Crea el registro de baja
     * - Recalcula el estado
     * - Devuelve el Agreement actualizado
     */
    public function cancel(Agreement $agreement, array $data): Agreement
    {
        if ($agreement->status === AgreementStatusEnum::Cancelado) {
            throw new \DomainException('El convenio ya está dado de baja.');
        }

        return DB::transaction(function () use ($agreement, $data) {
            $agreement->cancellations()->create([
                'agreement_id'   => $agreement->id,
                'resolution_id'  => $data['resolution_id'] ?? null,
                'cancelled_at'   => $data['cancelled_at'] ?? Carbon::now(),
                'reason'         => $data['reason'] ?? null,
            ]);

            $agreement->syncStatus();

            return $agreement->fresh();
        });
    }
}
