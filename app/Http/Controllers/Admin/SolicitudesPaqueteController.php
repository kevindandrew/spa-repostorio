<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SolicitudPaquete;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SolicitudesPaqueteController extends Controller
{
    public function index(Request $request): Response
    {
        $estadoFiltro = $request->input('estado', '');

        $query = SolicitudPaquete::with(['cliente.usuario', 'paquete.servicios'])
            ->orderByRaw("FIELD(estado, 'PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA')")
            ->orderByDesc('created_at');

        if ($estadoFiltro) {
            $query->where('estado', $estadoFiltro);
        }

        $solicitudes = $query->get()->map(fn($s) => [
            'id'           => $s->id,
            'cliente'      => $s->cliente->usuario->nombre ?? '—',
            'cliente_id'   => $s->cliente_id,
            'paquete'      => $s->paquete->nombre ?? '—',
            'paquete_id'   => $s->paquete_id,
            'precio'       => (float) ($s->paquete->precio ?? 0),
            'servicios'    => $s->paquete->servicios->map(fn($sv) => $sv->nombre)->toArray(),
            'notas'        => $s->notas,
            'estado'       => $s->estado,
            'creado'       => $s->created_at->format('d/m/Y H:i'),
        ]);

        $pendientes = SolicitudPaquete::where('estado', 'PENDIENTE')->count();

        return Inertia::render('Admin/SolicitudesPaquetes', [
            'solicitudes'   => $solicitudes,
            'estado_filtro' => $estadoFiltro,
            'pendientes'    => $pendientes,
        ]);
    }

    public function update(Request $request, SolicitudPaquete $solicitud): RedirectResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'])],
        ]);

        $solicitud->update($validated);

        return back()->with('success', 'Solicitud actualizada.');
    }
}
