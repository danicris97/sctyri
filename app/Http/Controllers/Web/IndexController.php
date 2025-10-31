<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\{
    Agreement,
};
use App\Enums\AgreementEnum;

class IndexController extends Controller
{
    public function index()
    {
        $agreements = Agreement::all()->count();
        $agreements_internationals = Agreement::where('international', true)->count();
        $pasantias = Agreement::where('type', AgreementEnum::Pasantia)->count();
        $pps = Agreement::where('type', AgreementEnum::PPS)->count();

        return Inertia::render('web/page', [
            'agreements' => $agreements,
            'agreements_internationals' => $agreements_internationals,
            'pasantias' => $pasantias,
            'pps' => $pps,
        ]);
    }
}
