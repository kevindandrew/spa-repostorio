<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Paquete;
use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaquetesController extends Controller
{
    public function index(): Response
    {
        $paquetes = Paquete::with('servicios')
            ->orderByDesc('fecha_inicio')
            ->get()
            ->map(fn($p) => [
                'id'           => $p->id,
                'nombre'       => $p->nombre,
                'descripcion'  => $p->descripcion,
                'precio'       => (float) $p->precio,
                'fecha_inicio' => $p->fecha_inicio->format('Y-m-d'),
                'fecha_fin'    => $p->fecha_fin->format('Y-m-d'),
                'activo'       => $p->activo,
                'vigente'      => $p->estaVigente(),
                'servicios'    => $p->servicios->map(fn($s) => [
                    'id'       => $s->id,
                    'nombre'   => $s->nombre,
                    'precio'   => (float) $s->precio,
                    'cantidad' => (int) ($s->pivot->cantidad ?? 1),
                ]),
            ]);

        $servicios = Servicio::where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($s) => [
                'id'     => $s->id,
                'nombre' => $s->nombre,
                'precio' => (float) $s->precio,
            ]);

        return Inertia::render('Admin/Paquetes', [
            'paquetes'  => $paquetes,
            'servicios' => $servicios,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'             => 'required|string|max:200',
            'descripcion'        => 'nullable|string|max:1000',
            'precio'             => 'required|numeric|min:0',
            'fecha_inicio'       => 'required|date',
            'fecha_fin'          => 'required|date|after_or_equal:fecha_inicio',
            'activo'             => 'boolean',
            'servicios'          => 'required|array|min:1',
            'servicios.*.id'     => 'required|exists:servicios,id',
            'servicios.*.cantidad' => 'required|integer|min:1|max:10',
        ]);

        $paquete = Paquete::create($validated);
        $paquete->servicios()->sync($this->buildSyncData($validated['servicios']));

        return back()->with('success', "Paquete \"{$paquete->nombre}\" creado.");
    }

    public function update(Request $request, Paquete $paquete): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'             => 'required|string|max:200',
            'descripcion'        => 'nullable|string|max:1000',
            'precio'             => 'required|numeric|min:0',
            'fecha_inicio'       => 'required|date',
            'fecha_fin'          => 'required|date|after_or_equal:fecha_inicio',
            'activo'             => 'boolean',
            'servicios'          => 'required|array|min:1',
            'servicios.*.id'     => 'required|exists:servicios,id',
            'servicios.*.cantidad' => 'required|integer|min:1|max:10',
        ]);

        $paquete->update($validated);
        $paquete->servicios()->sync($this->buildSyncData($validated['servicios']));

        return back()->with('success', "Paquete \"{$paquete->nombre}\" actualizado.");
    }

    public function destroy(Paquete $paquete): RedirectResponse
    {
        $nombre = $paquete->nombre;
        $paquete->delete();
        return back()->with('success', "Paquete \"{$nombre}\" eliminado.");
    }

    // Convierte [{id, cantidad}] → [uuid => ['cantidad' => n]] para sync()
    private function buildSyncData(array $servicios): array
    {
        return collect($servicios)
            ->mapWithKeys(fn($s) => [$s['id'] => ['cantidad' => (int) $s['cantidad']]])
            ->toArray();
    }
}
