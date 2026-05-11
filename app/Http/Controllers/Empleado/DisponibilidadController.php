<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\DisponibilidadEmpleado;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DisponibilidadController extends Controller
{
    public function index(): Response
    {
        $empleado = Auth::user()->empleado;

        $slots = DisponibilidadEmpleado::where('empleado_id', $empleado->id)
            ->orderBy('dia_semana')
            ->get()
            ->map(fn($d) => [
                'id'          => $d->id,
                'dia_semana'  => $d->dia_semana,
                'hora_inicio' => substr($d->hora_inicio, 0, 5),
                'hora_fin'    => substr($d->hora_fin, 0, 5),
                'activo'      => $d->activo,
            ]);

        return Inertia::render('Empleado/Disponibilidad', [
            'slots'    => $slots,
            'empleado' => [
                'nombre'      => Auth::user()->nombre,
                'especialidad'=> $empleado->especialidad,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dia_semana'  => 'required|integer|min:0|max:6',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin'    => 'required|date_format:H:i|after:hora_inicio',
        ]);

        $empleado = Auth::user()->empleado;

        DisponibilidadEmpleado::updateOrCreate(
            ['empleado_id' => $empleado->id, 'dia_semana' => $validated['dia_semana']],
            ['hora_inicio' => $validated['hora_inicio'], 'hora_fin' => $validated['hora_fin'], 'activo' => true]
        );

        return back()->with('success', 'Disponibilidad guardada.');
    }

    public function toggleActivo(DisponibilidadEmpleado $disponibilidad): RedirectResponse
    {
        abort_if($disponibilidad->empleado_id !== Auth::user()->empleado->id, 403);
        $disponibilidad->update(['activo' => !$disponibilidad->activo]);
        return back()->with('success', 'Disponibilidad actualizada.');
    }

    public function destroy(DisponibilidadEmpleado $disponibilidad): RedirectResponse
    {
        abort_if($disponibilidad->empleado_id !== Auth::user()->empleado->id, 403);
        $disponibilidad->delete();
        return back()->with('success', 'Horario eliminado.');
    }
}
