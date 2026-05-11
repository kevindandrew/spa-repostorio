<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Resena;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResenasController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cita_id'      => 'required|exists:citas,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario'   => 'nullable|string|max:500',
        ]);

        $cita    = Cita::with('resena')->findOrFail($validated['cita_id']);
        $cliente = Auth::user()->cliente;

        abort_if($cita->cliente_id !== $cliente->id, 403);
        abort_if($cita->estado !== 'COMPLETADA', 422, 'Solo puedes calificar citas completadas.');
        abort_if($cita->resena !== null, 422, 'Ya has calificado esta cita.');

        Resena::create([
            'cita_id'      => $cita->id,
            'cliente_id'   => $cliente->id,
            'empleado_id'  => $cita->empleado_id,
            'calificacion' => $validated['calificacion'],
            'comentario'   => $validated['comentario'] ?? null,
        ]);

        return back()->with('success', '¡Gracias por tu calificación!');
    }
}
