<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'q' => ['nullable','string','max:200'],
            'agreement' => ['array'],
            'agreement.file_id' => ['nullable','integer','exists:files,id'],
            'agreement.agreement_type' => ['nullable','string','max:100'],
            'agreement.year' => ['nullable','integer','digits:4'],
            'agreement.institution_id' => ['nullable','integer','exists:institutions,id'],
            'agreement.dependency_id' => ['nullable','integer','exists:dependencies,id'],
            'agreement.person_position_id' => ['nullable','integer','exists:person_positions,id'],
            'agreement.agreement_renewal_type' => ['nullable','string','max:100'],
            'agreement.international' => ['nullable','in:0,1,true,false'],
            'agreement.date_since' => ['nullable','date'],
            'agreement.date_until' => ['nullable','date','after_or_equal:agreement.date_since'],

            'file' => ['array'],
            'file.year' => ['nullable','string','max:4'],
            'file.type' => ['nullable','string','max:50'],
            'file.dependency_id' => ['nullable','integer','exists:dependencies,id'],
            'file.causative_dependency_id' => ['nullable','integer','exists:dependencies,id'],
            'file.causative_institution_id' => ['nullable','integer','exists:institutions,id'],
            'file.causative_person_id' => ['nullable','integer','exists:people,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Normalizaciones/casts si te llegan strings "true"/"false"
        $agreement = $this->input('agreement', []);
        if (array_key_exists('international', $agreement)) {
            $agreement['international'] = filter_var($agreement['international'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }
        $this->merge(['agreement' => $agreement]);
    }
}
