<?php

namespace App\Http\Requests\Admin\Documents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ResolutionEnum;

class StoreResolutionRequest extends FormRequest
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
            'number' => ['required', 'string', 'max:5'],
            'date' => ['required', 'date'],
            'type' => ['nullable', new Enum(ResolutionEnum::class)],
            'matter' => ['nullable', 'string', 'max:100'],
            'link' => ['nullable', 'string', 'max:255'],
            'file_id' => ['required', 'exists:files,id'],
        ];
    }

    public function messages()
    {
        return [
            'number.required' => 'El número de resolución es obligatorio.',
            'date.required' => 'La fecha de resolución es obligatoria.',
            'type.enum' => 'El tipo seleccionado no es válido.',
            'matter.max' => 'El título no puede exceder los 100 caracteres.',
            'link.max' => 'El enlace no puede exceder los 255 caracteres.',
            'file_id.exists' => 'El expediente seleccionado no existe.',
        ];
    }
}
