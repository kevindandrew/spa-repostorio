<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TokenRecuperacion;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'correo' => $request->correo,
            'token'  => $request->route('token'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token'    => 'required',
            'correo'   => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $tokenRecord = TokenRecuperacion::where('token', $request->token)
            ->where('tipo', 'RECUPERAR_CONTRASENA')
            ->where('usado', false)
            ->first();

        if (!$tokenRecord || !$tokenRecord->estaVigente()) {
            throw ValidationException::withMessages([
                'correo' => ['El enlace ha expirado o ya fue utilizado. Solicita uno nuevo.'],
            ]);
        }

        $user = Usuario::find($tokenRecord->usuario_id);

        if (!$user || $user->correo !== $request->correo) {
            throw ValidationException::withMessages([
                'correo' => ['El enlace no es válido.'],
            ]);
        }

        $user->forceFill([
            'password'              => $request->password,
            'debe_cambiar_password' => false,
        ])->save();

        $tokenRecord->update(['usado' => true]);

        return redirect()->route('login')->with('status', 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
    }
}
