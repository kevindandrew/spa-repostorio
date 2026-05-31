<?php

namespace App\Http\Middleware;

use App\Models\Cita;
use App\Models\SolicitudPaquete;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'solicitudesPendientes' => $request->user()?->rol === 'ADMIN'
                ? SolicitudPaquete::where('estado', 'PENDIENTE')->count()
                : 0,
            'notificacionesAdmin' => function () use ($request) {
                if ($request->user()?->rol !== 'ADMIN') {
                    return null;
                }

                $solicitudes = SolicitudPaquete::with('cliente.usuario')
                    ->where('estado', 'PENDIENTE')
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn($s) => [
                        'tipo'  => 'solicitud',
                        'texto' => 'Solicitud de paquete: ' . ($s->cliente->usuario->nombre ?? '—'),
                        'hace'  => $s->created_at->diffForHumans(),
                    ])
                    ->toArray();

                $citasHoy = Cita::with(['cliente.usuario', 'servicio'])
                    ->whereDate('fecha_hora_inicio', today())
                    ->where('estado', 'PENDIENTE')
                    ->orderBy('fecha_hora_inicio')
                    ->limit(5)
                    ->get()
                    ->map(fn($c) => [
                        'tipo'  => 'cita',
                        'texto' => ($c->cliente->usuario->nombre ?? '—') . ' — ' . ($c->servicio->nombre ?? '—'),
                        'hace'  => $c->fecha_hora_inicio->format('H:i'),
                    ])
                    ->toArray();

                $items = array_merge($solicitudes, $citasHoy);

                return [
                    'total' => count($items),
                    'items' => $items,
                ];
            },
        ];
    }
}
