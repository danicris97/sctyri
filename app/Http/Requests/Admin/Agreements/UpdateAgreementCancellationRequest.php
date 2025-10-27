<?php

namespace App\Http\Requests\Admin\Agreements;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgreementCancellationRequest extends FormRequest
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
            'resolution_id' => ['nullable', 'integer', 'exists:resolutions,id'],
            'reason' => ['required', 'string'],
            'cancellation_date' => ['required', 'date'],
        ];
    }

    public function messages()
    {
        return [
            'reason.required' => 'El motivo de la baja es obligatorio.',
            'cancellation_date.required' => 'La fecha de la baja es obligatoria.',
            'agreement_id.required' => 'El convenio es obligatorio.',
            'agreement_id.exists' => 'El convenio seleccionado no existe.',
            'resolution_id.exists' => 'La resolución seleccionada no existe.',
        ];
    }
}
