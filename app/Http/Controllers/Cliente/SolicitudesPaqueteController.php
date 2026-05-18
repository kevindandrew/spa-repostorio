<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Paquete;
use App\Models\SolicitudPaquete;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SolicitudesPaqueteController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'paquete_id' => 'required|exists:paquetes,id',
            'notas'      => 'nullable|string|max:500',
        ]);

        $paquete = Paquete::findOrFail($validated['paquete_id']);

        if (!$paquete->estaVigente()) {
            return back()->withErrors(['paquete_id' => 'Este paquete ya no está disponible.']);
        }

        $clienteId = Auth::user()->cliente->id;

        $yaExiste = SolicitudPaquete::where('cliente_id', $clienteId)
            ->where('paquete_id', $validated['paquete_id'])
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->exists();

        if ($yaExiste) {
            return back()->withErrors(['paquete_id' => 'Ya tienes una solicitud activa para este paquete.']);
        }

        SolicitudPaquete::create([
            'cliente_id' => $clienteId,
            'paquete_id' => $validated['paquete_id'],
            'notas'      => $validated['notas'] ?? null,
            'estado'     => 'PENDIENTE',
        ]);

        return back()->with('success', '¡Solicitud enviada! El equipo se pondrá en contacto contigo pronto.');
    }
}
