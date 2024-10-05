<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_name' => 'required',
            'client_name' => 'required',
            'description' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'project_name.required' => 'El nombre del proyecto es obligatorio',
            'client_name.required' => 'El nombre del cliente es obligatorio',
            'description.required' => 'La descripcion es obligatoria',
        ];
    }
}
