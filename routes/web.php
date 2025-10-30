<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Web\{
    IndexController, 
    SearchController,
    ContactController
};

Route::get('/', [IndexController::class, 'index'])->name('home');

Route::prefix('coope')->name('coope.')->group(function () {
    Route::get('/info-general', function () {
        return Inertia::render('web/coope/page-coope-info');
    })->name('info-general');

    Route::get('/uvt', function () {
        return Inertia::render('web/coope/page-uvt');
    })->name('uvt');

    Route::get('/cuepo', function () {
        return Inertia::render('web/coope/page-cuepo');
    })->name('cuepo');
});

Route::prefix('rrii')->name('rrii.')->group(function () {
    Route::get('/info-general', function () {
        return Inertia::render('web/rrii/page-rrii-info');
    })->name('info-general');

    Route::get('/ingresantes', function () {
        return Inertia::render('web/rrii/page-ingresantes');
    })->name('ingresantes');

    Route::get('/salientes', function () {
        return Inertia::render('web/rrii/page-salientes');
    })->name('salientes');
});

Route::get('/contacto', function () {
    return Inertia::render('web/contact');
})->name('contacto');

Route::post('/contacto', [ContactController::class, 'submit'])->name('contacto.submit');

Route::get('/busqueda', [SearchController::class, 'index'])->name('search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/api.php';