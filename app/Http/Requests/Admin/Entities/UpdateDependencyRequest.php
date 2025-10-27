<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\DependencyEnum;

class UpdateDependenciesRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', new Enum(DependencyEnum::class)],
            'abbreviation' => ['nullable', 'string', 'max:15'],
            'parent_dependency_id' => ['nullable', 'integer', 'exists:dependencies,id'],
            
            // Textos para crear o buscar nuevas ubicaciones
            'locality' => ['nullable','string','max:100'],
            
            'address' => ['nullable','string','max:150'],
            'phone' => ['nullable','string','max:16'],
            'email' => ['nullable','string','max:100'],
            'web' => ['nullable','string','max:150'],
            'status' => ['nullable', 'boolean'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la institución es obligatorio.',
            'name.max' => 'El nombre debe ser menor a 150 caracteres.',
            'type.required' => 'El tipo de institución es obligatorio.',
            'abbreviation.max' => 'La abreviación debe ser menor a 15 caracteres.',
            'parent_dependency_id.exists' => 'La dependencia padre seleccionada no es válida.',
            'email.email' => 'El formato del email es inválido.',
            'web.url' => 'El formato de la URL es inválido.',
            'locality.max' => 'El nombre de la localidad no puede exceder 100 caracteres.',
        ];
    }
}

