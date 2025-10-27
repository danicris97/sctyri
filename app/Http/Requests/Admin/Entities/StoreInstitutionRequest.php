<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\InstitucionEnum;

class StoreInstitutionsRequest extends FormRequest
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
            'name' => ['required','string','max:150'],
            'type' => ['required', 'max:50', new Enum(InstitucionEnum::class)],
            'cuit' => ['nullable','string','max:12'],
            // Textos para crear o buscar nuevas ubicaciones
            'country' => ['nullable','string','max:50'],
            'province' => ['nullable','string','max:100'],
            'locality' => ['nullable','string','max:100'],
            //
            'address' => ['nullable','string','max:150'],
            'phone' => ['nullable','string','max:16'],
            'email' => ['nullable','email','max:100'],
            'web' => ['nullable','string','max:150'],
            'active' => ['nullable','boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la institución es obligatorio.',
            'name.max' => 'El nombre debe ser menor a 150 caracteres.',
            'type.required' => 'El tipo de institución es obligatorio.',
            'email.email' => 'El formato del email es inválido.',
            'web.url' => 'El formato de la URL es inválido.',
            'country.max' => 'El nombre del país no puede exceder 50 caracteres.',
            'province.max' => 'El nombre de la provincia no puede exceder 100 caracteres.',
            'locality.max' => 'El nombre de la localidad no puede exceder 100 caracteres.',
        ];
    }
}
