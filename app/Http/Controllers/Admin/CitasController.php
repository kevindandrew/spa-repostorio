<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Servicio;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CitasController extends Controller
{
    public function index(Request $request): Response
    {
        $year  = (int) $request->input('year',  now()->year);
        $month = (int) $request->input('month', now()->month);

        $citas = Cita::with(['cliente.usuario', 'servicio', 'empleado.usuario'])
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
                'cliente_id'     => $c->cliente_id,
                'servicio'       => $c->servicio->nombre ?? '—',
                'servicio_id'    => $c->servicio_id,
                'empleado'       => $c->empleado->usuario->nombre ?? '—',
                'empleado_id'    => $c->empleado_id,
                'duracion'       => $c->servicio->duracion_minutos ?? 0,
                'precio_cobrado' => $c->precio_cobrado,
                'estado'         => $c->estado,
                'notas_cliente'  => $c->notas_cliente,
                'notas_empleado' => $c->notas_empleado,
            ]);

        return Inertia::render('Admin/Citas', [
            'citas'     => $citas,
            'year'      => $year,
            'month'     => $month,
            'empleados' => Empleado::with('usuario')->where('activo', true)->get()
                ->map(fn($e) => [
                    'id'           => $e->id,
                    'nombre'       => $e->usuario->nombre ?? '—',
                    'especialidad' => $e->especialidad,
                ]),
            'clientes'  => Cliente::with('usuario')->get()
                ->map(fn($c) => ['id' => $c->id, 'nombre' => $c->usuario->nombre ?? '—']),
            'servicios' => Servicio::where('activo', true)->get()
                ->map(fn($s) => [
                    'id'      => $s->id,
                    'nombre'  => $s->nombre,
                    'duracion'=> $s->duracion_minutos,
                    'precio'  => $s->precio,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cliente_id'        => 'required|exists:clientes,id',
            'empleado_id'       => 'required|exists:empleados,id',
            'servicio_id'       => 'required|exists:servicios,id',
            'fecha_hora_inicio' => 'required|date',
            'notas_cliente'     => 'nullable|string|max:500',
            'precio_cobrado'    => 'required|numeric|min:0',
        ]);

        $servicio = Servicio::findOrFail($validated['servicio_id']);
        $inicio   = Carbon::parse($validated['fecha_hora_inicio']);

        Cita::create([
            ...$validated,
            'fecha_hora_fin' => $inicio->copy()->addMinutes($servicio->duracion_minutos),
            'estado'         => 'PENDIENTE',
        ]);

        return back()->with('success', 'Cita creada correctamente.');
    }

    public function update(Request $request, Cita $cita): RedirectResponse
    {
        $validated = $request->validate([
            'cliente_id'        => 'sometimes|exists:clientes,id',
            'empleado_id'       => 'sometimes|exists:empleados,id',
            'servicio_id'       => 'sometimes|exists:servicios,id',
            'fecha_hora_inicio' => 'sometimes|date',
            'precio_cobrado'    => 'sometimes|numeric|min:0',
            'notas_empleado'    => 'nullable|string|max:500',
            'notas_cliente'     => 'nullable|string|max:500',
            'estado'            => ['sometimes', Rule::in(['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO'])],
        ]);

        $cita->update($validated);

        if (isset($validated['fecha_hora_inicio']) || isset($validated['servicio_id'])) {
            $servicio = Servicio::find($cita->servicio_id);
            $cita->fecha_hora_fin = Carbon::parse($cita->fecha_hora_inicio)
                ->addMinutes($servicio->duracion_minutos ?? 60);
            $cita->save();
        }

        return back()->with('success', 'Cita actualizada.');
    }

    public function destroy(Cita $cita): RedirectResponse
    {
        $cita->delete();
        return back()->with('success', 'Cita eliminada.');
    }
}
