<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TokenRecuperacion;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'correo' => 'required|email',
        ]);

        $user = Usuario::where('correo', $request->correo)->first();

        if ($user) {
            // Invalidate any previous reset tokens for this user
            TokenRecuperacion::where('usuario_id', $user->id)
                ->where('tipo', 'RECUPERAR_CONTRASENA')
                ->where('usado', false)
                ->update(['usado' => true]);

            $token = Str::random(64);

            TokenRecuperacion::create([
                'usuario_id' => $user->id,
                'token'      => $token,
                'tipo'       => 'RECUPERAR_CONTRASENA',
                'expira_en'  => now()->addHour(),
                'usado'      => false,
                'created_at' => now(),
            ]);

            $url = route('password.reset', ['token' => $token, 'correo' => $user->correo]);

            Mail::raw(
                "Hola {$user->nombre},\n\nRecibimos una solicitud para restablecer tu contraseña.\n\nHaz clic en el siguiente enlace (válido por 60 minutos):\n\n{$url}\n\nSi no solicitaste esto, ignora este mensaje.",
                fn($m) => $m->to($user->correo)->subject('Restablecer contraseña — Spa')
            );
        }

        // Always return success to avoid email enumeration
        return back()->with('status', 'Si el correo existe en nuestro sistema, recibirás un enlace en breve.');
    }
}
