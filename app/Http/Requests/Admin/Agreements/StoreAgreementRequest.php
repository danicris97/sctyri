<?php

namespace App\Http\Requests\Admin\Agreements;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\AgreementEnum;
use App\Enums\AgreementRenewalEnum;
use App\Enums\ResolutionEnum;

class StoreAgreementRequest extends FormRequest
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
            'type' => ['required', 'string', 'max:60', new Enum(AgreementEnum::class)],
            'date_signature' => ['required', 'date'],
            'duration' => ['required', 'integer'],
            'type_renewal' => ['nullable', 'string', 'max:30', new Enum(AgreementRenewalEnum::class)],
            'international' => ['nullable', 'boolean'],
            'object' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:255'],
            'observations' => ['nullable', 'string', 'max:255'],

            'resolution.number' => ['required', 'string', 'max:5'],
            'resolution.date' => ['required', 'date'],
            'resolution.type' => ['nullable', 'string', 'max:50', new Enum(ResolutionEnum::class)],
            'resolution.matter' => ['nullable', 'string', 'max:100'],
            'resolution.link' => ['nullable', 'string', 'max:255'],
            'resolution.file_id' => ['required', 'integer', 'exists:files,id'],

            'institutions' => ['nullable', 'array'],
            'institutions.*.id' => ['required', 'integer', 'exists:institutions,id'],

            'dependencies' => ['nullable', 'array'],
            'dependencies.*.id' => ['required', 'integer', 'exists:dependencies,id'],

            'person_positions' => ['nullable', 'array'],
            'person_positions.*.id' => ['required', 'integer', 'exists:person_positions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'El tipo de convenio es obligatorio.',
            'type.max' => 'El tipo de convenio no puede superar 60 caracteres.',
            'date_signature.required' => 'La fecha de firma es obligatoria.',
            'date_signature.date' => 'La fecha de firma debe ser una fecha valida.',
            'duration.required' => 'La duracion es obligatoria.',
            'duration.integer' => 'La duracion debe ser un numero entero.',
            'type_renewal.max' => 'El tipo de renovacion debe tener como maximo 30 caracteres.',
            'international.boolean' => 'El campo internacional debe ser un booleano.',
            'resolution.number.required' => 'El numero de la resolucion es obligatorio.',
            'resolution.number.max' => 'El numero de la resolucion no puede superar 5 caracteres.',
            'resolution.date.required' => 'La fecha de la resolucion es obligatoria.',
            'resolution.date.date' => 'La fecha de la resolucion debe ser una fecha valida.',
            'resolution.type.max' => 'El tipo de la resolucion debe tener como maximo 50 caracteres.',
            'resolution.link.max' => 'El enlace de la resolucion debe tener como maximo 255 caracteres.',
            'resolution.file_id.exists' => 'El expediente de la resolucion seleccionado no existe.',
            'institutions.*.id.exists' => 'Una o mas instituciones seleccionadas no existen.',
            'dependencies.*.id.exists' => 'Una o mas unidades academicas seleccionadas no existen.',
            'person_positions.*.id.exists' => 'Uno o mas firmantes UNSA seleccionados no existen.',
        ];
    }
}
