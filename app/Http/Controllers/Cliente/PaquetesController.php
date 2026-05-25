<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Paquete;
use Inertia\Inertia;
use Inertia\Response;

class PaquetesController extends Controller
{
    public function index(): Response
    {
        $hoy = now()->startOfDay();

        $paquetes = Paquete::with('servicios')
            ->where('activo', true)
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->orderBy('fecha_fin')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'nombre'      => $p->nombre,
                'descripcion' => $p->descripcion,
                'precio'      => (float) $p->precio,
                'fecha_fin'   => $p->fecha_fin->format('d/m/Y'),
                'dias_restantes' => (int) now()->startOfDay()->diffInDays($p->fecha_fin),
                'servicios'   => $p->servicios->map(fn($s) => [
                    'id'       => $s->id,
                    'nombre'   => $s->nombre,
                    'precio'   => (float) $s->precio,
                    'cantidad' => (int) ($s->pivot->cantidad ?? 1),
                ]),
                'precio_original' => $p->servicios->sum(fn($s) => $s->precio * ($s->pivot->cantidad ?? 1)),
                'ahorro'          => max(0, $p->servicios->sum(fn($s) => $s->precio * ($s->pivot->cantidad ?? 1)) - (float) $p->precio),
            ]);

        return Inertia::render('Cliente/Paquetes', [
            'paquetes' => $paquetes,
        ]);
    }
}
