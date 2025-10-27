<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use App\Enums\PersonPositionEnum;

class UpdatePersonPositionRequest extends FormRequest
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
        // Determinamos si se está proporcionando un persona_id válido
        $creatingNewPerson = $this->input('person_id') === null;

        $rules = [
            // El campo person_id es opcional. Si se envía, debe existir en la tabla 'personas'.
            'person_id' => ['nullable','exists:persons,id',],
            'position' => ['required', new Enum(PersonPositionEnum::class)],
            'active' => ['nullable', 'boolean'],
        ];

        if ($creatingNewPerson) {
            // Campos anidados de persona (cuando viene como objeto person.*)
            $rules['person.name'] = ['required', 'string', 'max:100'];
            $rules['person.surname'] = ['required', 'string', 'max:100'];
            $rules['person.dni'] = ['nullable','string','max:10',
                Rule::unique('persons', 'dni')->whereNotNull('dni'),
            ];
            $rules['person.email'] = ['nullable','string','email','max:100',
                Rule::unique('persons', 'email')->whereNotNull('email'),
            ];
            $rules['person.phone'] = ['nullable', 'string', 'max:16'];
            $rules['person.address'] = ['nullable', 'string', 'max:150'];
            $rules['person.nacionality'] = ['nullable', 'string', 'max:50'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'person_id.exists' => 'La persona seleccionada no es válida.',
            'position.max' => 'El puesto debe ser menor a 50 caracteres.',
            'active.boolean' => 'El campo activo debe ser verdadero o falso.',

            // Mensajes para campos anidados de persona
            'person.name.required' => 'El nombre de la persona es obligatorio.',
            'person.name.max' => 'El nombre de la persona debe ser menor a 100 caracteres.',
            'person.surname.required' => 'El apellido de la persona es obligatorio.',
            'person.surname.max' => 'El apellido de la persona debe ser menor a 100 caracteres.',
            'person.dni.max' => 'El DNI debe ser menor a 10 caracteres.',
            'person.dni.unique' => 'El DNI ya está registrado para otra persona.',
            'person.email.email' => 'El formato del email es inválido.',
            'person.email.max' => 'El email debe ser menor a 100 caracteres.',
            'person.email.unique' => 'El email ya está registrado para otra persona.',
            'person.phone.max' => 'El teléfono debe ser menor a 16 caracteres.',
            'person.address.max' => 'El domicilio debe ser menor a 150 caracteres.',
            'person.nacionality.max' => 'La nacionalidad debe ser menor a 50 caracteres.',
        ];
    }
}
