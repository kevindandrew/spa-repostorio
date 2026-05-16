<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\CambiarPasswordController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\VerificarCorreoController;
use App\Http\Controllers\Auth\VerificarDosFactoresController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('cambiar-password', [CambiarPasswordController::class, 'show'])
        ->name('password.change');
    Route::post('cambiar-password', [CambiarPasswordController::class, 'update'])
        ->name('password.change.update');

    // Verificación de correo (clientes)
    Route::get('verificar-correo', [VerificarCorreoController::class, 'show'])
        ->name('verificar.correo');
    Route::post('verificar-correo', [VerificarCorreoController::class, 'store'])
        ->name('verificar.correo.store');
    Route::post('verificar-correo/reenviar', [VerificarCorreoController::class, 'reenviar'])
        ->name('verificar.correo.reenviar');

    // 2FA para empleados (sin estar autenticado)
});

Route::middleware('guest')->group(function () {
    Route::get('verificar-2fa', [VerificarDosFactoresController::class, 'show'])
        ->name('2fa.show');
    Route::post('verificar-2fa', [VerificarDosFactoresController::class, 'store'])
        ->name('2fa.store');
    Route::post('verificar-2fa/reenviar', [VerificarDosFactoresController::class, 'reenviar'])
        ->name('2fa.reenviar');
});
