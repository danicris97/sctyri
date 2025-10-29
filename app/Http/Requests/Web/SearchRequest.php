<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'q' => ['nullable','string','max:200'],
            'convenio' => ['array'],
            'convenio.expediente_id' => ['nullable','integer','exists:expedientes,id'],
            'convenio.tipo_convenio' => ['nullable','string','max:100'],
            'convenio.anio_resolucion' => ['nullable','integer','digits:4'],
            'convenio.institucion_id' => ['nullable','integer','exists:instituciones,id'],
            'convenio.dependencia_id' => ['nullable','integer','exists:dependencias_unsa,id'],
            'convenio.firmante_unsa_id' => ['nullable','integer','exists:personas_roles,id'],
            'convenio.tipo_renovacion' => ['nullable','string','max:100'],
            'convenio.internacional' => ['nullable','in:0,1,true,false'],
            'convenio.fecha_desde' => ['nullable','date'],
            'convenio.fecha_hasta' => ['nullable','date','after_or_equal:convenio.fecha_desde'],

            'expediente' => ['array'],
            'expediente.anio' => ['nullable','string','max:4'],
            'expediente.tipo' => ['nullable','string','max:50'],
            'expediente.dependencia_id' => ['nullable','integer','exists:dependencias_unsa,id'],
            'expediente.causante_dependencia_id' => ['nullable','integer','exists:dependencias_unsa,id'],
            'expediente.causante_institucion_id' => ['nullable','integer','exists:instituciones,id'],
            'expediente.causante_persona_id' => ['nullable','integer','exists:personas,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Normalizaciones/casts si te llegan strings "true"/"false"
        $convenio = $this->input('convenio', []);
        if (array_key_exists('internacional', $convenio)) {
            $convenio['internacional'] = filter_var($convenio['internacional'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }
        $this->merge(['convenio' => $convenio]);
    }
}
