<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\DisponibilidadEmpleado;
use App\Models\Empleado;
use App\Models\Servicio;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReservarController extends Controller
{
    public function index(Request $request): Response
    {
        $servicios = Servicio::with('categoria')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'nombre'       => $s->nombre,
                'descripcion'  => $s->descripcion,
                'categoria'    => $s->categoria->nombre ?? '—',
                'categoria_id' => $s->categoria_id,
                'duracion'     => $s->duracion_minutos,
                'precio'       => (float) $s->precio,
            ]);

        $empleados = Empleado::with('usuario')
            ->withAvg('resenas', 'calificacion')
            ->withCount('resenas')
            ->where('activo', true)
            ->get()
            ->map(fn($e) => [
                'id'               => $e->id,
                'nombre'           => $e->usuario->nombre ?? '—',
                'especialidad'     => $e->especialidad,
                'bio'              => $e->bio,
                'categoria_id'     => $e->categoria_id,
                'avg_calificacion' => $e->resenas_avg_calificacion
                                        ? round((float) $e->resenas_avg_calificacion, 1)
                                        : null,
                'total_resenas'    => $e->resenas_count,
            ]);

        $diasDisponibles = null;
        $slots           = null;
        $perfilEmpleado  = null;

        if ($request->filled('perfil_empleado_id')) {
            $pe = Empleado::with([
                    'usuario',
                    'resenas' => fn($q) => $q->latest()->limit(10),
                ])
                ->withAvg('resenas', 'calificacion')
                ->withCount('resenas')
                ->findOrFail($request->perfil_empleado_id);

            $perfilEmpleado = [
                'id'               => $pe->id,
                'nombre'           => $pe->usuario->nombre ?? '—',
                'especialidad'     => $pe->especialidad,
                'bio'              => $pe->bio,
                'avg_calificacion' => $pe->resenas_avg_calificacion
                                        ? round((float) $pe->resenas_avg_calificacion, 1)
                                        : null,
                'total_resenas'    => $pe->resenas_count,
                'resenas'          => $pe->resenas->map(fn($r) => [
                    'calificacion' => $r->calificacion,
                    'comentario'   => $r->comentario,
                    'fecha'        => $r->created_at->format('d M Y'),
                ])->toArray(),
            ];
        }

        if ($request->filled('empleado_id')) {
            $diasDisponibles = DisponibilidadEmpleado::where('empleado_id', $request->empleado_id)
                ->where('activo', true)
                ->pluck('dia_semana')
                ->toArray();
        }

        if ($request->filled(['servicio_id', 'empleado_id', 'fecha'])) {
            $slots = $this->computeSlots(
                $request->servicio_id,
                $request->empleado_id,
                $request->fecha
            );
        }

        return Inertia::render('Cliente/Reservar', [
            'servicios'       => $servicios,
            'empleados'       => $empleados,
            'slots'           => $slots,
            'diasDisponibles' => $diasDisponibles,
            'perfilEmpleado'  => $perfilEmpleado,
            'preselect'       => [
                'servicio_id' => $request->servicio_id,
                'empleado_id' => $request->empleado_id,
                'fecha'       => $request->fecha,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'servicio_id'   => 'required|exists:servicios,id',
            'empleado_id'   => 'required|exists:empleados,id',
            'fecha'         => 'required|date|after_or_equal:today',
            'hora'          => 'required|date_format:H:i',
            'notas_cliente' => 'nullable|string|max:500',
        ]);

        $servicio = Servicio::findOrFail($validated['servicio_id']);
        $empleado = Empleado::findOrFail($validated['empleado_id']);

        if ($empleado->categoria_id && $servicio->categoria_id !== $empleado->categoria_id) {
            return back()->withErrors(['servicio_id' => 'El servicio no pertenece a la categoría del especialista.']);
        }

        $inicio   = Carbon::createFromFormat('Y-m-d H:i', $validated['fecha'] . ' ' . $validated['hora']);
        $fin      = $inicio->copy()->addMinutes($servicio->duracion_minutos);

        // Overlap check including BREAK_MINUTOS buffer between appointments
        $conflict = Cita::where('empleado_id', $validated['empleado_id'])
            ->whereNotIn('estado', ['CANCELADA'])
            ->where('fecha_hora_inicio', '<', $fin->copy()->addMinutes(self::BREAK_MINUTOS))
            ->where('fecha_hora_fin', '>', $inicio->copy()->subMinutes(self::BREAK_MINUTOS))
            ->exists();

        abort_if($conflict, 409, 'Este horario ya no está disponible. Por favor elige otro.');

        Cita::create([
            'cliente_id'        => Auth::user()->cliente->id,
            'empleado_id'       => $validated['empleado_id'],
            'servicio_id'       => $validated['servicio_id'],
            'fecha_hora_inicio' => $inicio,
            'fecha_hora_fin'    => $fin,
            'estado'            => 'PENDIENTE',
            'precio_cobrado'    => $servicio->precio,
            'notas_cliente'     => $validated['notas_cliente'] ?? null,
        ]);

        return redirect()->route('cliente.citas.index')
            ->with('success', '¡Cita reservada con éxito! Te esperamos.');
    }

    private const BREAK_MINUTOS = 15;

    private function computeSlots(string $servicioId, string $empleadoId, string $fechaStr): array
    {
        $servicio  = Servicio::findOrFail($servicioId);
        $fecha     = Carbon::parse($fechaStr)->startOfDay();
        $diaSemana = $fecha->dayOfWeek; // 0=Dom, 1=Lun … 6=Sáb

        $disponibilidad = DisponibilidadEmpleado::where('empleado_id', $empleadoId)
            ->where('dia_semana', $diaSemana)
            ->where('activo', true)
            ->first();

        if (!$disponibilidad) {
            return [];
        }

        $citasExistentes = Cita::where('empleado_id', $empleadoId)
            ->whereDate('fecha_hora_inicio', $fecha->format('Y-m-d'))
            ->whereNotIn('estado', ['CANCELADA'])
            ->get();

        $duracion = (int) $servicio->duracion_minutos;
        $break    = self::BREAK_MINUTOS;

        [$hI, $mI] = array_map('intval', explode(':', substr($disponibilidad->hora_inicio, 0, 5)));
        [$hF, $mF] = array_map('intval', explode(':', substr($disponibilidad->hora_fin,    0, 5)));

        $startMin = $hI * 60 + $mI;
        $endMin   = $hF * 60 + $mF;

        $slots      = [];
        $currentMin = $startMin;

        while ($currentMin + $duracion <= $endMin) {
            $h = intdiv($currentMin, 60);
            $m = $currentMin % 60;

            $slotInicio = Carbon::createFromFormat(
                'Y-m-d H:i',
                $fecha->format('Y-m-d') . ' ' . sprintf('%02d:%02d', $h, $m)
            );
            $slotFin = $slotInicio->copy()->addMinutes($duracion);

            if ($slotInicio->isAfter(now())) {
                // Slot is free if every existing appointment ends at least BREAK_MINUTOS
                // before this slot starts, and this slot ends at least BREAK_MINUTOS
                // before the next appointment starts.
                $isFree = $citasExistentes->every(
                    fn($c) => $slotFin->copy()->addMinutes($break)->lte($c->fecha_hora_inicio)
                           || $c->fecha_hora_fin->copy()->addMinutes($break)->lte($slotInicio)
                );

                if ($isFree) {
                    $slots[] = sprintf('%02d:%02d', $h, $m);
                }
            }

            $currentMin += 15; // 15-min grid to match break precision
        }

        return $slots;
    }
}
