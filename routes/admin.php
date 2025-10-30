<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Agreements\{
    AgreementController,
    AgreementRenewalController,
    AgreementCancellationController,

};
use App\Http\Controllers\Entities\{
    DependencyController,
    InstitutionController,
    PersonPositionController,
};
use App\Http\Controllers\Documents\{
    FileController,
    ResolutionController,
    FileMovementController,
};
use App\Http\Controllers\{
    UserController
};

// Middleware base: auth, verified, y algún rol válido
Route::middleware(['auth', 'verified', 'role_or_permission:admin|user|becario'])->prefix('admin')->group(function () {
    // agreements
    Route::prefix('agreements')->name('agreements.')->group(function () {
        // agreements
        Route::prefix('agreements')->name('agreements.')->group(function () {
            Route::get('/', [AgreementController::class, 'index'])->name('index');
            Route::get('/crear', [AgreementController::class, 'create'])->name('create');
            Route::post('/', [AgreementController::class, 'store'])->name('store');
            Route::get('/{agreement}/editar', [AgreementController::class, 'edit'])->name('edit');
            Route::put('/{agreement}', [AgreementController::class, 'update'])->name('update');
            Route::get('/exportar', [AgreementController::class, 'export'])->name('export');
            Route::get('/{agreement}/bajas/crear', [AgreementCancellationController::class, 'createForConvenio'])->name('cancellation.create');
            Route::post('/bajas', [AgreementCancellationController::class, 'storeForConvenio'])->name('cancellation.store');
            Route::get('/{agreement}/renovaciones/crear', [AgreementRenewalController::class, 'createForConvenio'])->name('renewal.create');
            Route::post('/renovaciones', [AgreementRenewalController::class, 'storeForConvenio'])->name('renewal.store');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{agreement}', [AgreementController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        // Renovaciones Convenio
        Route::prefix('agreement-renewals')->name('agreement-renewals.')->group(function () {
            Route::get('/', [AgreementRenewalController::class, 'index'])->name('index');
            Route::get('/crear', [AgreementRenewalController::class, 'create'])->name('create');
            Route::post('/', [AgreementRenewalController::class, 'store'])->name('store');
            Route::get('/{agreementRenewal}/editar', [AgreementRenewalController::class, 'edit'])->name('edit');
            Route::put('/{agreementRenewal}', [AgreementRenewalController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{agreementRenewal}', [AgreementRenewalController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        // Bajas Convenio
        Route::prefix('agreement-cancellations')->name('agreement-cancellations.')->group(function () {
            Route::get('/', [AgreementCancellationController::class, 'index'])->name('index');
            Route::get('/crear', [AgreementCancellationController::class, 'create'])->name('create');
            Route::post('/', [AgreementCancellationController::class, 'store'])->name('store');
            Route::get('/{agreementCancellation}/editar', [AgreementCancellationController::class, 'edit'])->name('edit');
            Route::put('/{agreementCancellation}', [AgreementCancellationController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{agreementCancellation}', [AgreementCancellationController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });
    });
    
    //Entidades
    Route::prefix('entities')->name('entities.')->group(function () {
        // Instituciones
        Route::prefix('institutions')->name('institutions.')->group(function () {
            Route::get('/', [InstitutionController::class, 'index'])->name('index');
            Route::get('/crear', [InstitutionController::class, 'create'])->name('create');
            Route::post('/', [InstitutionController::class, 'store'])->name('store');
            Route::get('/{institution}/editar', [InstitutionController::class, 'edit'])->name('edit');
            Route::put('/{institution}', [InstitutionController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{institution}', [InstitutionController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        // Dependencias
        Route::prefix('dependencies')->name('dependencies.')->group(function () {
            Route::get('/', [DependencyController::class, 'index'])->name('index');
            Route::get('/crear', [DependencyController::class, 'create'])->name('create');
            Route::post('/', [DependencyController::class, 'store'])->name('store');
            Route::get('/{dependency}/editar', [DependencyController::class, 'edit'])->name('edit');
            Route::put('/{dependency}', [DependencyController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{dependency}', [DependencyController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        //Personas
        Route::prefix('person-position')->name('person-position.')->group(function () {
            Route::get('/', [PersonPositionController::class, 'index'])->name('index');
            Route::get('/crear', [PersonPositionController::class, 'create'])->name('create');
            Route::post('/', [PersonPositionController::class, 'store'])->name('store');
            Route::get('/{person-position}/editar', [PersonPositionController::class, 'edit'])->name('edit');
            Route::put('/{person-position}', [PersonPositionController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{person-position}', [PersonPositionController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });
    });

    //Documentos
    Route::prefix('documents')->name('documents.')->group(function () {
        // Expedientes
        Route::prefix('files')->name('files.')->group(function () {
            Route::get('/', [FileController::class, 'index'])->name('index');
            Route::get('/crear', [FileController::class, 'create'])->name('create');
            Route::post('/', [FileController::class, 'store'])->name('store');
            Route::get('/{file}/editar', [FileController::class, 'edit'])->name('edit');
            Route::put('/{file}', [FileController::class, 'update'])->name('update');
            Route::get('/{file}/movimientos/crear', [FileMovementController::class, 'createForFile'])->name('movements.create');
            Route::post('/movimientos', [FileMovementController::class, 'storeForFile'])->name('movements.store');
            Route::get('/{file}/resoluciones/crear', [ResolutionController::class, 'createForFile'])->name('resolutions.create');
            Route::post('/resoluciones', [ResolutionController::class, 'storeForFile'])->name('resolutions.store');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{file}', [FileController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        // Resoluciones
        Route::prefix('resolutions')->name('resolutions.')->group(function () {
            Route::get('/', [ResolutionController::class, 'index'])->name('index');
            Route::get('/crear', [ResolutionController::class, 'create'])->name('create');
            Route::post('/', [ResolutionController::class, 'store'])->name('store');
            Route::get('/{resolution}/editar', [ResolutionController::class, 'edit'])->name('edit');
            Route::put('/{resolution}', [ResolutionController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{resolution}', [ResolutionController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });

        //Movimientos
        Route::prefix('movements')->name('movements.')->group(function () {
            Route::get('/', [FileMovementController::class, 'index'])->name('index');
            Route::get('/crear', [FileMovementController::class, 'create'])->name('create');
            Route::post('/', [FileMovementController::class, 'store'])->name('store');
            Route::get('/{movement}/editar', [FileMovementController::class, 'edit'])->name('edit');
            Route::put('/{movement}', [FileMovementController::class, 'update'])->name('update');
            
            // Solo admin y user pueden eliminar
            Route::delete('/{movement}', [FileMovementController::class, 'destroy'])
                ->middleware('role:admin|user')
                ->name('destroy');
        });
    });

    // Usuarios - Solo admin
    Route::middleware('role:admin')->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/crear', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{user}/editar', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });
    });
});

require __DIR__.'/auth.php';