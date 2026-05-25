<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Empleado;
use App\Models\Servicio;
use App\Models\SolicitudPaquete;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SolicitudesPaqueteController extends Controller
{
    private const BREAK_MINUTOS = 15;

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
            'id'               => $s->id,
            'cliente'          => $s->cliente->usuario->nombre ?? '—',
            'cliente_id'       => $s->cliente_id,
            'paquete'          => $s->paquete->nombre ?? '—',
            'paquete_id'       => $s->paquete_id,
            'precio'           => (float) ($s->paquete->precio ?? 0),
            'notas'            => $s->notas,
            'estado'           => $s->estado,
            'creado'           => $s->created_at->format('d/m/Y H:i'),
            // Nombres para la tabla (con badge ×N si cantidad > 1)
            'servicios'        => $s->paquete->servicios->map(fn($sv) => [
                'nombre'   => $sv->nombre,
                'cantidad' => (int) ($sv->pivot->cantidad ?? 1),
            ])->toArray(),
            // Detalle expandido para el modal: una fila por sesión
            'servicios_detalle' => $s->paquete->servicios->flatMap(function ($sv) {
                $cantidad = (int) ($sv->pivot->cantidad ?? 1);
                return collect(range(1, $cantidad))->map(fn($n) => [
                    'id'           => $sv->id,
                    'nombre'       => $sv->nombre . ($cantidad > 1 ? " (sesión {$n}/{$cantidad})" : ''),
                    'categoria_id' => $sv->categoria_id,
                    'duracion'     => (int) $sv->duracion_minutos,
                    'precio'       => (float) $sv->precio,
                ]);
            })->values()->toArray(),
        ]);

        $pendientes = SolicitudPaquete::where('estado', 'PENDIENTE')->count();

        $empleados = Empleado::with('usuario')
            ->where('activo', true)
            ->get()
            ->map(fn($e) => [
                'id'           => $e->id,
                'nombre'       => $e->usuario->nombre ?? '—',
                'categoria_id' => $e->categoria_id,
            ]);

        return Inertia::render('Admin/SolicitudesPaquetes', [
            'solicitudes'   => $solicitudes,
            'estado_filtro' => $estadoFiltro,
            'pendientes'    => $pendientes,
            'empleados'     => $empleados,
        ]);
    }

    public function update(Request $request, SolicitudPaquete $solicitud): RedirectResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'])],
        ]);

        $solicitud->update($validated);

        return back()->with('success', 'Estado actualizado.');
    }

    public function asignarCitas(Request $request, SolicitudPaquete $solicitud): RedirectResponse
    {
        $validated = $request->validate([
            'asignaciones'                   => 'required|array|min:1',
            'asignaciones.*.servicio_id'     => 'required|exists:servicios,id',
            'asignaciones.*.empleado_id'     => 'required|exists:empleados,id',
            'asignaciones.*.fecha'           => 'required|date|after_or_equal:today',
            'asignaciones.*.hora'            => 'required|date_format:H:i',
        ]);

        foreach ($validated['asignaciones'] as $index => $asig) {
            $servicio = Servicio::findOrFail($asig['servicio_id']);
            $empleado = Empleado::findOrFail($asig['empleado_id']);

            // Validar categoría
            if ($empleado->categoria_id && $servicio->categoria_id !== $empleado->categoria_id) {
                return back()->withErrors([
                    "asignaciones.{$index}.empleado_id" =>
                        "El especialista no corresponde a la categoría del servicio \"{$servicio->nombre}\".",
                ]);
            }

            $inicio = Carbon::createFromFormat('Y-m-d H:i', $asig['fecha'] . ' ' . $asig['hora']);
            $fin    = $inicio->copy()->addMinutes($servicio->duracion_minutos);

            // Validar conflicto de horario
            $conflict = Cita::where('empleado_id', $asig['empleado_id'])
                ->whereNotIn('estado', ['CANCELADA'])
                ->where('fecha_hora_inicio', '<', $fin->copy()->addMinutes(self::BREAK_MINUTOS))
                ->where('fecha_hora_fin',    '>', $inicio->copy()->subMinutes(self::BREAK_MINUTOS))
                ->exists();

            if ($conflict) {
                return back()->withErrors([
                    "asignaciones.{$index}.hora" =>
                        "Conflicto de horario para \"{$servicio->nombre}\". El especialista no está disponible (incluye 15 min de descanso).",
                ]);
            }

            Cita::create([
                'cliente_id'        => $solicitud->cliente_id,
                'empleado_id'       => $asig['empleado_id'],
                'servicio_id'       => $asig['servicio_id'],
                'fecha_hora_inicio' => $inicio,
                'fecha_hora_fin'    => $fin,
                'estado'            => 'PENDIENTE',
                'precio_cobrado'    => $servicio->precio,
            ]);
        }

        $solicitud->update(['estado' => 'EN_PROCESO']);

        return back()->with('success', 'Citas asignadas correctamente. La solicitud está en proceso.');
    }
}
