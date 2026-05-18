<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Servicio;
use Carbon\Carbon;
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

        $ingresosSemana = Cita::where('estado', 'COMPLETADA')
            ->whereBetween('fecha_hora_inicio', [
                $hoy->copy()->startOfWeek(Carbon::MONDAY),
                $hoy->copy()->endOfWeek(Carbon::SUNDAY),
            ])
            ->sum('precio_cobrado');

        // Timeline: citas de hoy ordenadas
        $timeline = Cita::with(['cliente.usuario', 'servicio', 'empleado.usuario'])
            ->whereDate('fecha_hora_inicio', $hoy)
            ->orderBy('fecha_hora_inicio')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'hora'           => $c->fecha_hora_inicio->format('H:i'),
                'cliente'        => $c->cliente->usuario->nombre ?? '—',
                'servicio'       => $c->servicio->nombre ?? '—',
                'empleado'       => $c->empleado->usuario->nombre ?? '—',
                'estado'         => $c->estado,
                'precio_cobrado' => $c->precio_cobrado,
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

        // --- CHARTS ---

        // 1. Distribución de citas por estado (mes actual)
        $citasPorEstado = Cita::whereMonth('fecha_hora_inicio', $hoy->month)
            ->whereYear('fecha_hora_inicio', $hoy->year)
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado')
            ->toArray();

        // 2. Ingresos por día — últimos 7 días
        $ingresosPorDia = collect(range(6, 0))->map(function ($daysAgo) {
            $fecha = today()->subDays($daysAgo);
            $ingreso = Cita::where('estado', 'COMPLETADA')
                ->whereDate('fecha_hora_inicio', $fecha)
                ->sum('precio_cobrado');
            return [
                'dia'      => $fecha->locale('es')->isoFormat('ddd D'),
                'ingresos' => (float) $ingreso,
            ];
        })->values()->toArray();

        // 3. Citas por día de semana (histórico, Lun=1 … Dom=7)
        $DIAS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        $citasPorDiaSemana = Cita::select(
                DB::raw('DAYOFWEEK(fecha_hora_inicio) as dow'),
                DB::raw('count(*) as total')
            )
            ->groupBy('dow')
            ->orderBy('dow')
            ->get()
            ->map(fn($r) => [
                // DAYOFWEEK: 1=Dom,2=Lun…7=Sáb → remap to Lun…Dom
                'dia'   => ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][$r->dow - 1] ?? '?',
                'citas' => (int) $r->total,
            ])
            ->toArray();

        // 4. Top 5 servicios más solicitados
        $topServicios = Cita::with('servicio')
            ->select('servicio_id', DB::raw('count(*) as total'))
            ->groupBy('servicio_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'nombre' => $r->servicio->nombre ?? '—',
                'total'  => (int) $r->total,
            ])
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'citasHoy'         => $citasHoy,
                'empleadosActivos' => $empleadosActivos,
                'clientesNuevos'   => $clientesNuevos,
                'ingresosSemana'   => (float) $ingresosSemana,
            ],
            'timeline'          => $timeline,
            'actividad'         => $actividad,
            'citasPorEstado'    => $citasPorEstado,
            'ingresosPorDia'    => $ingresosPorDia,
            'citasPorDiaSemana' => $citasPorDiaSemana,
            'topServicios'      => $topServicios,
        ]);
    }
}
