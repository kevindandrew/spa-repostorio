<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EspecialistasController extends Controller
{
    public function index(): Response
    {
        $empleados = Empleado::with('usuario')
            ->withCount([
                'citas',
                'resenas',
                'citas as completadas_count' => fn($q) => $q->where('estado', 'COMPLETADA'),
                'citas as canceladas_count'  => fn($q) => $q->where('estado', 'CANCELADA'),
            ])
            ->withAvg('resenas', 'calificacion')
            ->withSum(['citas as ingresos_total' => fn($q) => $q->where('estado', 'COMPLETADA')], 'precio_cobrado')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($e) => [
                'id'                 => $e->id,
                'nombre'             => $e->usuario->nombre ?? '—',
                'correo'             => $e->usuario->correo ?? '—',
                'especialidad'       => $e->especialidad,
                'telefono'           => $e->telefono,
                'bio'                => $e->bio,
                'fecha_contratacion' => $e->fecha_contratacion?->format('Y-m-d'),
                'activo'             => $e->activo,
                'total_citas'        => $e->citas_count,
                'completadas_count'  => $e->completadas_count ?? 0,
                'canceladas_count'   => $e->canceladas_count ?? 0,
                'ingresos_total'     => (float) ($e->ingresos_total ?? 0),
                'avg_calificacion'   => $e->resenas_avg_calificacion
                                          ? round((float) $e->resenas_avg_calificacion, 1)
                                          : null,
                'total_resenas'      => $e->resenas_count,
                'usuario_id'         => $e->usuario_id,
                'bloqueado'          => $e->usuario?->bloqueado_hasta && now()->isBefore($e->usuario->bloqueado_hasta),
            ]);

        return Inertia::render('Admin/Especialistas', [
            'empleados' => $empleados,
        ]);
    }

    public function desbloquear(Usuario $usuario): RedirectResponse
    {
        $usuario->forceFill([
            'intentos_fallidos' => 0,
            'bloqueado_hasta'   => null,
        ])->saveQuietly();

        return back()->with('success', "Cuenta de \"{$usuario->nombre}\" desbloqueada.");
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'             => 'required|string|max:100',
            'correo'             => 'required|email|unique:usuarios,correo',
            'especialidad'       => 'required|string|max:100',
            'telefono'           => 'required|string|max:20',
            'bio'                => 'nullable|string|max:500',
            'fecha_contratacion' => 'required|date',
        ]);

        $usuario = Usuario::create([
            'nombre'                => $validated['nombre'],
            'correo'                => $validated['correo'],
            'password'              => Hash::make($validated['telefono']),
            'rol'                   => 'EMPLEADO',
            'correo_verificado'     => true,
            'activo'                => true,
            'debe_cambiar_password' => true,
        ]);

        Empleado::create([
            'usuario_id'         => $usuario->id,
            'especialidad'       => $validated['especialidad'],
            'telefono'           => $validated['telefono'] ?? null,
            'bio'                => $validated['bio'] ?? null,
            'fecha_contratacion' => $validated['fecha_contratacion'],
            'activo'             => true,
        ]);

        return back()->with('success', 'Especialista creado correctamente.');
    }

    public function update(Request $request, Empleado $empleado): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'             => 'required|string|max:100',
            'especialidad'       => 'required|string|max:100',
            'telefono'           => 'nullable|string|max:20',
            'bio'                => 'nullable|string|max:500',
            'fecha_contratacion' => 'required|date',
            'activo'             => 'boolean',
        ]);

        $empleado->usuario->update(['nombre' => $validated['nombre']]);
        $empleado->update([
            'especialidad'       => $validated['especialidad'],
            'telefono'           => $validated['telefono'] ?? null,
            'bio'                => $validated['bio'] ?? null,
            'fecha_contratacion' => $validated['fecha_contratacion'],
            'activo'             => $validated['activo'] ?? $empleado->activo,
        ]);

        return back()->with('success', 'Especialista actualizado.');
    }

    public function destroy(Empleado $empleado): RedirectResponse
    {
        $empleado->update(['activo' => false]);
        return back()->with('success', 'Especialista desactivado.');
    }
}
