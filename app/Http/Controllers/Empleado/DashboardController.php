<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $empleado = Auth::user()->empleado;
        $hoy = today();

        $citasHoy = Cita::with(['cliente.usuario', 'servicio'])
            ->where('empleado_id', $empleado->id)
            ->whereDate('fecha_hora_inicio', $hoy)
            ->orderBy('fecha_hora_inicio')
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'hora_inicio'      => $c->fecha_hora_inicio->format('H:i'),
                'hora_fin'         => $c->fecha_hora_fin->format('H:i'),
                'cliente'          => $c->cliente->usuario->nombre ?? '—',
                'servicio'         => $c->servicio->nombre ?? '—',
                'duracion'         => $c->servicio->duracion_minutos ?? 0,
                'estado'           => $c->estado,
                'notas_cliente'    => $c->notas_cliente,
                'notas_empleado'   => $c->notas_empleado,
                'precio_cobrado'   => $c->precio_cobrado,
            ]);

        $proximaCita = $citasHoy->first(fn($c) => $c['estado'] === 'PENDIENTE' || $c['estado'] === 'CONFIRMADA');

        // Disponibilidad del empleado (días configurados)
        $disponibilidad = $empleado->disponibilidades()
            ->where('activo', true)
            ->orderBy('dia_semana')
            ->get(['dia_semana', 'hora_inicio', 'hora_fin'])
            ->map(fn($d) => [
                'dia'         => $d->dia_semana,
                'hora_inicio' => substr($d->hora_inicio, 0, 5),
                'hora_fin'    => substr($d->hora_fin, 0, 5),
            ]);

        $avgCalificacion = $empleado->resenas()->avg('calificacion');
        $totalResenas    = $empleado->resenas()->count();

        return Inertia::render('Empleado/Dashboard', [
            'empleado'     => [
                'nombre'           => Auth::user()->nombre,
                'especialidad'     => $empleado->especialidad,
                'avg_calificacion' => $avgCalificacion ? round((float) $avgCalificacion, 1) : null,
                'total_resenas'    => $totalResenas,
            ],
            'citasHoy'      => $citasHoy,
            'proximaCita'   => $proximaCita,
            'disponibilidad'=> $disponibilidad,
        ]);
    }
}
