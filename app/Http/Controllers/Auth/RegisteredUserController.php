<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Usuario;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Auth\VerificarCorreoController;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'correo'   => 'required|string|lowercase|email|max:255|unique:usuarios,correo',
            'telefono' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $usuario = Usuario::create([
            'nombre'   => $request->nombre,
            'correo'   => $request->correo,
            'password' => Hash::make($request->password),
            'rol'      => 'CLIENTE',
            'activo'   => true,
        ]);

        Cliente::create([
            'usuario_id' => $usuario->id,
            'telefono'   => $request->telefono,
        ]);

        event(new Registered($usuario));
        Auth::login($usuario);

        VerificarCorreoController::generarCodigo($usuario);

        return redirect()->route('verificar.correo');
    }
}
