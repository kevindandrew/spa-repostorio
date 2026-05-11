<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Empleado;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $hoy = today();

        $citasHoy = Cita::whereDate('fecha_hora_inicio', $hoy)->count();

        $empleadosActivos = Empleado::where('activo', true)->count();

        $clientesNuevos = Cliente::whereMonth('created_at', $hoy->month)
            ->whereYear('created_at', $hoy->year)
            ->count();

        // Timeline: citas de hoy ordenadas
        $timeline = Cita::with(['cliente.usuario', 'servicio', 'empleado.usuario'])
            ->whereDate('fecha_hora_inicio', $hoy)
            ->orderBy('fecha_hora_inicio')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'hora'            => $c->fecha_hora_inicio->format('H:i'),
                'cliente'         => $c->cliente->usuario->nombre ?? '—',
                'servicio'        => $c->servicio->nombre ?? '—',
                'empleado'        => $c->empleado->usuario->nombre ?? '—',
                'estado'          => $c->estado,
                'precio_cobrado'  => $c->precio_cobrado,
            ]);

        // Actividad reciente (últimas 5 citas modificadas)
        $actividad = Cita::with(['cliente.usuario', 'servicio'])
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'estado'   => $c->estado,
                'cliente'  => $c->cliente->usuario->nombre ?? '—',
                'servicio' => $c->servicio->nombre ?? '—',
                'tiempo'   => $c->updated_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'citasHoy'        => $citasHoy,
                'empleadosActivos'=> $empleadosActivos,
                'clientesNuevos'  => $clientesNuevos,
            ],
            'timeline' => $timeline,
            'actividad' => $actividad,
        ]);
    }
}
