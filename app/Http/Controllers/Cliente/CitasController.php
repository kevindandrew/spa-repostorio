<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CitasController extends Controller
{
    public function index(Request $request): Response
    {
        $cliente      = Auth::user()->cliente;
        $filtroEstado = $request->get('estado', 'todas');

        $query = Cita::with(['servicio', 'empleado.usuario', 'resena'])
            ->where('cliente_id', $cliente->id)
            ->orderByDesc('fecha_hora_inicio');

        if ($filtroEstado !== 'todas') {
            $query->where('estado', $filtroEstado);
        }

        $citas = $query->get()->map(fn($c) => [
            'id'            => $c->id,
            'fecha'         => $c->fecha_hora_inicio->format('d M Y'),
            'dia'           => $c->fecha_hora_inicio->format('d'),
            'mes'           => $c->fecha_hora_inicio->format('M'),
            'hora'          => $c->fecha_hora_inicio->format('H:i'),
            'servicio'      => $c->servicio->nombre ?? '—',
            'duracion'      => $c->servicio->duracion_minutos ?? null,
            'empleado'      => $c->empleado->usuario->nombre ?? '—',
            'estado'        => $c->estado,
            'precio'        => $c->precio_cobrado,
            'notas_cliente'  => $c->notas_cliente,
            'notas_empleado' => $c->notas_empleado,
            'resena'         => $c->resena ? [
                'calificacion' => $c->resena->calificacion,
                'comentario'   => $c->resena->comentario,
            ] : null,
        ]);

        return Inertia::render('Cliente/Citas', [
            'citas'        => $citas,
            'filtroEstado' => $filtroEstado,
        ]);
    }

    public function cancelar(Cita $cita): RedirectResponse
    {
        abort_if($cita->cliente_id !== Auth::user()->cliente->id, 403);
        abort_if(!in_array($cita->estado, ['PENDIENTE', 'CONFIRMADA']), 422);

        $cita->update(['estado' => 'CANCELADA']);
        return back()->with('success', 'Cita cancelada correctamente.');
    }
}
