<?php

namespace App\Actions\Entities;

use App\Models\{
    PersonPosition,
    Person,
};
use Illuminate\Support\Facades\DB;

class CreatePersonPosition
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function __invoke(array $data, ResolveCountry $resolveCountry): PersonPosition
    {
        if($data['nationality']){
            $nationalityId = $resolveCountry($data['nationality']);
        }

        return DB::transaction(function () use ($data, $nationalityId) {
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

            $person = null;

            if (!empty($data['person_id'])) {
                $person = Person::find($data['person_id']);

                if ($person && $personAttributes !== []) {
                    $person->update($personAttributes);
                }
            } else {
                $person = Person::create($personAttributes);
            }

            if (!$person) {
                throw new \RuntimeException('No se pudo encontrar o crear la persona.');
            }

            return PersonPosition::create([
                'person_id' => $person->id,
                'position' => $data['position'],
                'active' => $data['active'] ?? true,
            ]);
        });
    }
}
