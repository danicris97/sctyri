<?php

namespace App\Http\Requests\Admin\Agreements;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgreementRenewalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'agreement_id' => ['required', 'integer', 'exists:agreements,id'],
            'start_date' => ['required', 'date'],
            'duration' => ['required', 'integer'],
            'end_date' => ['nullable', 'date'],
            'resolution_id' => ['nullable', 'integer', 'exists:resolutions,id'],
            'observations' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'agreement_id.required' => 'El convenio es obligatorio.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'duration.required' => 'La duración es obligatoria.',
            'end_date.date' => 'La fecha debe tener un formato valido.',
            'resolution_id.exists' => 'La resolución no existe.',
            'observations.max' => 'Las observaciones no pueden exceder los 255 caracteres.',
        ];
    }
}
