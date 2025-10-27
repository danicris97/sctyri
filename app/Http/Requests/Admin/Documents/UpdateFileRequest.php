<?php

namespace App\Http\Requests\Admin\Documents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\FileEnum;

class UpdateFileRequest extends FormRequest
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
            'number' => ['required', 'string', 'max:7'],
            'year' => ['required', 'digits:4'],
            'causative_id' => ['nullable', 'integer'],
            'causatuve_type' => ['nullable', 'string', 'max:50'],
            'statement' => ['nullable', 'string'],
            'type' => ['nullable', new Enum(FileEnum::class)],
            'dependency_id' => ['nullable', 'exists:dependencies,id'],
            'opening_date' => ['nullable', 'date'],
            'close_date' => ['nullable', 'date', 'after:opening_date'],
            'observations' => ['nullable', 'string'],
            'international' => ['nullable', 'boolean'],
        ];
    }

    public function messages()
    {
        return [
            'number.required' => 'El numero de expediente es obligatorio.',
            'year.required' => 'El anio del expediente es obligatorio.',
            'year.digits' => 'El anio del expediente debe tener cuatro digitos.',
            'opening_adte.date' => 'La fecha de inicio debe ser una fecha valida.',
            'closing_date.date' => 'La fecha de cierre debe ser una fecha valida.',
            'closing_date.after' => 'La fecha de cierre debe ser mayor a la fecha de inicio.',
            'type.enum' => 'El tipo seleccionado no es valido.',
            'dependency_id.exists' => 'La dependencia no existe.',
            'international.boolean' => 'El valor de internacional debe ser verdadero o falso.',
        ];
    }
}
