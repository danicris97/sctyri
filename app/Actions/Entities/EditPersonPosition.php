<?php

namespace App\Actions\Entities;

use App\Models\PersonPosition;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class EditPersonPosition
{
    public function __invoke(PersonPosition $personPosition, array $data, ResolveCountry $resolveCountry): PersonPosition
    {
        if($data['nationality']){
            $nationalityId = $resolveCountry($data['nationality']);
        }

        return DB::transaction(function () use ($personPosition, $data, $nationalityId) {
            $personAttributes = array_intersect_key($data, array_flip([
                'name',
                'surname',
                'dni',
                'email',
                'phone',
                'address',
                'nationality',
            ]));

            if (array_key_exists('nationality', $personAttributes)) {
                $personAttributes['nationality'] = $nationalityId;
            }

            $person = $personPosition->person;

            if (!$person) {
                throw new RuntimeException('No se encontró la persona asociada a la posición.');
            }

            if ($personAttributes !== []) {
                $person->update($personAttributes);
            }

            $personPositionAttributes = array_intersect_key($data, array_flip([
                'position',
                'active',
            ]));

            if (!array_key_exists('active', $personPositionAttributes)) {
                $personPositionAttributes['active'] = $data['active'] ?? true;
            }

            if ($personPositionAttributes !== []) {
                $personPosition->update($personPositionAttributes);
            }

            return $personPosition->refresh();
        });
    }
}
