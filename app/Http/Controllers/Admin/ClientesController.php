<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ClientesController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Cliente::with('usuario')->withCount('citas');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('usuario', fn($q) =>
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('correo', 'like', "%{$search}%")
            );
        }

        $clientes = $query->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                'id'            => $c->id,
                'nombre'        => $c->usuario->nombre ?? '—',
                'correo'        => $c->usuario->correo ?? '—',
                'telefono'      => $c->telefono,
                'total_citas'   => $c->citas_count,
                'ultima_visita' => $c->citas()
                    ->whereIn('estado', ['COMPLETADA'])
                    ->orderByDesc('fecha_hora_inicio')
                    ->first()
                    ?->fecha_hora_inicio
                    ?->format('d/m/Y') ?? '—',
            ]);

        return Inertia::render('Admin/Clientes', [
            'clientes' => $clientes,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre'           => 'required|string|max:255',
            'correo'           => 'required|string|lowercase|email|max:255|unique:usuarios,correo',
            'telefono'         => 'required|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
        ]);

        $usuario = Usuario::create([
            'nombre'   => $request->nombre,
            'correo'   => $request->correo,
            'password' => Hash::make($request->telefono),
            'rol'      => 'CLIENTE',
            'activo'   => true,
        ]);

        Cliente::create([
            'usuario_id'       => $usuario->id,
            'telefono'         => $request->telefono,
            'fecha_nacimiento' => $request->fecha_nacimiento,
        ]);

        return redirect()->route('admin.clientes.index')
            ->with('success', "Cliente \"{$request->nombre}\" registrado. Contraseña inicial: {$request->telefono}");
    }

    public function show(Cliente $cliente): Response
    {
        $historial = Cita::with(['servicio', 'empleado.usuario'])
            ->where('cliente_id', $cliente->id)
            ->orderByDesc('fecha_hora_inicio')
            ->get()
            ->map(fn($c) => [
                'id'      => $c->id,
                'fecha'   => $c->fecha_hora_inicio->format('d/m/Y'),
                'hora'    => $c->fecha_hora_inicio->format('H:i'),
                'servicio'=> $c->servicio->nombre ?? '—',
                'empleado'=> $c->empleado->usuario->nombre ?? '—',
                'estado'  => $c->estado,
                'precio'  => $c->precio_cobrado,
            ]);

        return Inertia::render('Admin/ClienteDetalle', [
            'cliente' => [
                'id'               => $cliente->id,
                'nombre'           => $cliente->usuario->nombre ?? '—',
                'correo'           => $cliente->usuario->correo ?? '—',
                'telefono'         => $cliente->telefono,
                'fecha_nacimiento' => $cliente->fecha_nacimiento?->format('d/m/Y'),
                'preferencias'     => $cliente->preferencias,
                'alergias'         => $cliente->alergias,
                'total_citas'      => $historial->count(),
                'completadas'      => $historial->where('estado', 'COMPLETADA')->count(),
            ],
            'historial' => $historial,
        ]);
    }
}
