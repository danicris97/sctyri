<?php

namespace App\Http\Controllers\website;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\{
    Convenio,
};
use App\Http\Enum\ConvenioEnum;

class InicioController extends Controller
{
    public function index()
    {
        $convenios = Convenio::all()->count();
        $convenios_internacionales = Convenio::where('internacional', true)->count();
        $pasantias = Convenio::where('tipo_convenio', ConvenioEnum::Pasantia)->count();
        $pps = Convenio::where('tipo_convenio', ConvenioEnum::PPS)->count();

        return Inertia::render('website/page', [
            'convenios' => $convenios,
            'convenios_internacionales' => $convenios_internacionales,
            'pasantias' => $pasantias,
            'pps' => $pps,
        ]);
    }
}
