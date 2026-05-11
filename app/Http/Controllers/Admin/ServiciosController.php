<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiciosController extends Controller
{
    public function index(): Response
    {
        $servicios = Servicio::with('categoria')
            ->orderBy('nombre')
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'nombre'       => $s->nombre,
                'descripcion'  => $s->descripcion,
                'categoria'    => $s->categoria->nombre ?? '—',
                'categoria_id' => $s->categoria_id,
                'duracion'     => $s->duracion_minutos,
                'precio'       => $s->precio,
                'activo'       => $s->activo,
            ]);

        $categorias = CategoriaServicio::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Admin/Servicios', [
            'servicios'  => $servicios,
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:120',
            'descripcion'      => 'nullable|string|max:500',
            'categoria_id'     => 'required|exists:categorias_servicio,id',
            'duracion_minutos' => 'required|integer|min:5|max:480',
            'precio'           => 'required|numeric|min:0',
            'activo'           => 'boolean',
        ]);

        Servicio::create($validated);
        return back()->with('success', 'Servicio creado.');
    }

    public function update(Request $request, Servicio $servicio): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:120',
            'descripcion'      => 'nullable|string|max:500',
            'categoria_id'     => 'required|exists:categorias_servicio,id',
            'duracion_minutos' => 'required|integer|min:5|max:480',
            'precio'           => 'required|numeric|min:0',
            'activo'           => 'boolean',
        ]);

        $servicio->update($validated);
        return back()->with('success', 'Servicio actualizado.');
    }

    public function destroy(Servicio $servicio): RedirectResponse
    {
        $servicio->delete();
        return back()->with('success', 'Servicio eliminado.');
    }
}
