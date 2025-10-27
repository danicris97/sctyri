<?php

namespace App\Http\Requests\Admin\Documents;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovementFileRequest extends FormRequest
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
            'file_id' => ['required', 'integer', 'exists:files,id'],
            'dependency_id' => ['required', 'integer', 'exists:dependencies,id'],
            'fojas' => ['required', 'string', 'max:4'],
            'date' => ['required', 'date'],
            'purpose' => ['nullable', 'string'],
            'observations' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'file_id.required' => 'El expediente es obligatorio.',
            'file_id.exists' => 'El expediente seleccionado no existe.',
            'dependency_id.required' => 'La dependencia destino es obligatoria.',
            'dependency_id.exists' => 'La dependencia destino seleccionada no existe.',
            'folios.required' => 'Las fojas son obligatorias.',
            'folios.max' => 'Las fojas no pueden superar 4 caracteres.',
            'date.required' => 'La fecha del movimiento es obligatoria.',
            'date.date' => 'La fecha del movimiento debe ser una fecha valida.',
        ];
    }
}

