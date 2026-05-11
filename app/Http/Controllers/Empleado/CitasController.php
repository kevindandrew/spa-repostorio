<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CitasController extends Controller
{
    public function index(Request $request): Response
    {
        $empleado = Auth::user()->empleado;
        $year     = (int) $request->input('year',  now()->year);
        $month    = (int) $request->input('month', now()->month);

        $citas = Cita::with(['cliente.usuario', 'servicio'])
            ->where('empleado_id', $empleado->id)
            ->whereYear('fecha_hora_inicio', $year)
            ->whereMonth('fecha_hora_inicio', $month)
            ->orderBy('fecha_hora_inicio')
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'fecha'          => $c->fecha_hora_inicio->format('Y-m-d'),
                'hora'           => $c->fecha_hora_inicio->format('H:i'),
                'hora_fin'       => $c->fecha_hora_fin->format('H:i'),
                'cliente'        => $c->cliente->usuario->nombre ?? '—',
                'servicio'       => $c->servicio->nombre ?? '—',
                'duracion'       => $c->servicio->duracion_minutos ?? 0,
                'precio_cobrado' => $c->precio_cobrado,
                'estado'         => $c->estado,
                'notas_cliente'  => $c->notas_cliente,
                'notas_empleado' => $c->notas_empleado,
            ]);

        return Inertia::render('Empleado/Citas', [
            'citas' => $citas,
            'year'  => $year,
            'month' => $month,
        ]);
    }

    public function update(Request $request, Cita $cita): RedirectResponse
    {
        // Employee can only update their own citas
        abort_if($cita->empleado_id !== Auth::user()->empleado->id, 403);

        $validated = $request->validate([
            'estado'         => ['sometimes', Rule::in(['CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO'])],
            'notas_empleado' => 'nullable|string|max:500',
        ]);

        $cita->update($validated);

        return back()->with('success', 'Cita actualizada.');
    }
}
