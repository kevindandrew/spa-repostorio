<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $cliente = Auth::user()->cliente;

        $proximaCita = Cita::with(['servicio', 'empleado.usuario'])
            ->where('cliente_id', $cliente->id)
            ->where('fecha_hora_inicio', '>', now())
            ->whereIn('estado', ['PENDIENTE', 'CONFIRMADA'])
            ->orderBy('fecha_hora_inicio')
            ->first();

        $citasRecientes = Cita::with(['servicio', 'empleado.usuario'])
            ->where('cliente_id', $cliente->id)
            ->orderByDesc('fecha_hora_inicio')
            ->limit(4)
            ->get()
            ->map(fn($c) => [
                'id'          => $c->id,
                'fecha'       => $c->fecha_hora_inicio->format('d M Y'),
                'hora'        => $c->fecha_hora_inicio->format('H:i'),
                'servicio'    => $c->servicio->nombre ?? '—',
                'empleado'    => $c->empleado->usuario->nombre ?? '—',
                'estado'      => $c->estado,
                'precio'      => $c->precio_cobrado,
            ]);

        $servicios = Servicio::with('categoria')
            ->where('activo', true)
            ->orderBy('nombre')
            ->limit(8)
            ->get()
            ->map(fn($s) => [
                'id'        => $s->id,
                'nombre'    => $s->nombre,
                'categoria' => $s->categoria->nombre ?? '—',
                'duracion'  => $s->duracion_minutos,
                'precio'    => $s->precio,
            ]);

        return Inertia::render('Cliente/Dashboard', [
            'proximaCita'   => $proximaCita ? [
                'id'       => $proximaCita->id,
                'fecha'    => $proximaCita->fecha_hora_inicio->format('d \d\e M, Y'),
                'hora'     => $proximaCita->fecha_hora_inicio->format('H:i'),
                'servicio' => $proximaCita->servicio->nombre ?? '—',
                'empleado' => $proximaCita->empleado->usuario->nombre ?? '—',
                'estado'   => $proximaCita->estado,
            ] : null,
            'citasRecientes' => $citasRecientes,
            'servicios'      => $servicios,
        ]);
    }
}
