<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoriasController extends Controller
{
    public function index(): Response
    {
        $categorias = CategoriaServicio::withCount(['servicios'])
            ->orderBy('nombre')
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'nombre'          => $c->nombre,
                'descripcion'     => $c->descripcion,
                'activo'          => $c->activo,
                'total_servicios' => $c->servicios_count,
            ]);

        return Inertia::render('Admin/Categorias', [
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:100|unique:categorias_servicio,nombre',
            'descripcion' => 'nullable|string|max:500',
            'activo'      => 'boolean',
        ]);

        CategoriaServicio::create($validated);
        return back()->with('success', 'Categoría creada.');
    }

    public function update(Request $request, CategoriaServicio $categoria): RedirectResponse
    {
        $validated = $request->validate([
            'nombre'      => ['required', 'string', 'max:100', Rule::unique('categorias_servicio', 'nombre')->ignore($categoria->id)],
            'descripcion' => 'nullable|string|max:500',
            'activo'      => 'boolean',
        ]);

        $categoria->update($validated);
        return back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(CategoriaServicio $categoria): RedirectResponse
    {
        if ($categoria->servicios()->exists()) {
            return back()->withErrors(['categoria' => "No se puede eliminar: tiene {$categoria->servicios()->count()} servicio(s) asignado(s)."])->with('error', "No se puede eliminar: la categoría tiene servicios asignados.");
        }

        $categoria->delete();
        return back()->with('success', 'Categoría eliminada.');
    }
}
