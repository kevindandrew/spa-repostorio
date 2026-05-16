<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\CitasController as AdminCitas;
use App\Http\Controllers\Admin\ServiciosController as AdminServicios;
use App\Http\Controllers\Admin\EspecialistasController as AdminEspecialistas;
use App\Http\Controllers\Admin\ClientesController as AdminClientes;
use App\Http\Controllers\Admin\PaquetesController as AdminPaquetes;
use App\Http\Controllers\Cliente\PaquetesController as ClientePaquetes;
use App\Http\Controllers\Empleado\DashboardController as EmpleadoDashboard;
use App\Http\Controllers\Empleado\CitasController as EmpleadoCitas;
use App\Http\Controllers\Empleado\DisponibilidadController as EmpleadoDisponibilidad;
use App\Http\Controllers\Cliente\DashboardController as ClienteDashboard;
use App\Http\Controllers\Cliente\CitasController as ClienteCitas;
use App\Http\Controllers\Cliente\ReservarController as ClienteReservar;
use App\Http\Controllers\Cliente\ResenasController as ClienteResenas;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Resena;

// Raíz → landing page
Route::get('/', function () {
    $resenas = Resena::latest()
        ->whereNotNull('comentario')
        ->where('comentario', '!=', '')
        ->limit(5)
        ->get()
        ->map(fn($r) => [
            'calificacion' => $r->calificacion,
            'comentario'   => $r->comentario,
            'fecha'        => $r->created_at->format('d/m/Y'),
        ]);

    return Inertia::render('Welcome', ['resenas' => $resenas]);
})->name('home');

// ── ADMIN ──────────────────────────────────────────────
Route::middleware(['auth', 'role:ADMIN'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

        // Citas
        Route::get('/citas',                [AdminCitas::class, 'index'])->name('citas.index');
        Route::post('/citas',               [AdminCitas::class, 'store'])->name('citas.store');
        Route::patch('/citas/{cita}',       [AdminCitas::class, 'update'])->name('citas.update');
        Route::delete('/citas/{cita}',      [AdminCitas::class, 'destroy'])->name('citas.destroy');

        // Servicios
        Route::get('/servicios',            [AdminServicios::class, 'index'])->name('servicios.index');
        Route::post('/servicios',           [AdminServicios::class, 'store'])->name('servicios.store');
        Route::patch('/servicios/{servicio}',[AdminServicios::class, 'update'])->name('servicios.update');
        Route::delete('/servicios/{servicio}',[AdminServicios::class, 'destroy'])->name('servicios.destroy');

        // Especialistas
        Route::get('/especialistas',                          [AdminEspecialistas::class, 'index'])->name('especialistas.index');
        Route::post('/especialistas',                         [AdminEspecialistas::class, 'store'])->name('especialistas.store');
        Route::patch('/especialistas/{empleado}',             [AdminEspecialistas::class, 'update'])->name('especialistas.update');
        Route::delete('/especialistas/{empleado}',            [AdminEspecialistas::class, 'destroy'])->name('especialistas.destroy');
        Route::post('/especialistas/{usuario}/desbloquear',   [AdminEspecialistas::class, 'desbloquear'])->name('especialistas.desbloquear');

        // Paquetes / Promociones
        Route::get('/paquetes',              [AdminPaquetes::class, 'index'])->name('paquetes.index');
        Route::post('/paquetes',             [AdminPaquetes::class, 'store'])->name('paquetes.store');
        Route::patch('/paquetes/{paquete}',  [AdminPaquetes::class, 'update'])->name('paquetes.update');
        Route::delete('/paquetes/{paquete}', [AdminPaquetes::class, 'destroy'])->name('paquetes.destroy');

        // Clientes
        Route::get('/clientes',                         [AdminClientes::class, 'index'])->name('clientes.index');
        Route::post('/clientes',                        [AdminClientes::class, 'store'])->name('clientes.store');
        Route::get('/clientes/{cliente}',               [AdminClientes::class, 'show'])->name('clientes.show');
        Route::post('/clientes/{usuario}/desbloquear',  [AdminClientes::class, 'desbloquear'])->name('clientes.desbloquear');
    });

// ── EMPLEADO ───────────────────────────────────────────
Route::middleware(['auth', 'role:EMPLEADO'])
    ->prefix('empleado')
    ->name('empleado.')
    ->group(function () {
        Route::get('/dashboard', [EmpleadoDashboard::class, 'index'])->name('dashboard');

        // Citas propias
        Route::get('/citas',              [EmpleadoCitas::class, 'index'])->name('citas.index');
        Route::patch('/citas/{cita}',     [EmpleadoCitas::class, 'update'])->name('citas.update');

        // Disponibilidad
        Route::get('/disponibilidad',                            [EmpleadoDisponibilidad::class, 'index'])->name('disponibilidad.index');
        Route::post('/disponibilidad',                           [EmpleadoDisponibilidad::class, 'store'])->name('disponibilidad.store');
        Route::patch('/disponibilidad/{disponibilidad}/toggle',  [EmpleadoDisponibilidad::class, 'toggleActivo'])->name('disponibilidad.toggle');
        Route::delete('/disponibilidad/{disponibilidad}',        [EmpleadoDisponibilidad::class, 'destroy'])->name('disponibilidad.destroy');
    });

// ── CLIENTE ────────────────────────────────────────────
Route::middleware(['auth', 'role:CLIENTE'])
    ->prefix('cliente')
    ->name('cliente.')
    ->group(function () {
        Route::get('/dashboard', [ClienteDashboard::class, 'index'])->name('dashboard');

        // Mis Citas
        Route::get('/citas',                     [ClienteCitas::class, 'index'])->name('citas.index');
        Route::patch('/citas/{cita}/cancelar',   [ClienteCitas::class, 'cancelar'])->name('citas.cancelar');

        // Reservar
        Route::get('/reservar',  [ClienteReservar::class, 'index'])->name('reservar.index');
        Route::post('/reservar', [ClienteReservar::class, 'store'])->name('reservar.store');

        // Reseñas
        Route::post('/resenas',  [ClienteResenas::class, 'store'])->name('resenas.store');

        // Paquetes / Promociones
        Route::get('/paquetes',  [ClientePaquetes::class, 'index'])->name('paquetes.index');
    });

// Alias legacy /dashboard → redirige según rol
Route::get('/dashboard', function () {
    $rol = auth()->user()->rol ?? null;
    return match ($rol) {
        'ADMIN'    => redirect()->route('admin.dashboard'),
        'EMPLEADO' => redirect()->route('empleado.dashboard'),
        'CLIENTE'  => redirect()->route('cliente.dashboard'),
        default    => redirect()->route('login'),
    };
})->middleware('auth')->name('dashboard');

// ── PERFIL (compartido) ────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
