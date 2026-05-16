<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class VerificarCorreoController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/VerificarCorreo', [
            'correo' => auth()->user()->correo,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (
            !$user->token_verificacion ||
            !$user->token_exp ||
            now()->isAfter($user->token_exp)
        ) {
            return back()->withErrors(['codigo' => 'El código ha expirado. Solicita uno nuevo.']);
        }

        if ($request->codigo !== $user->token_verificacion) {
            return back()->withErrors(['codigo' => 'El código ingresado no es correcto.']);
        }

        $user->update([
            'correo_verificado'   => true,
            'token_verificacion'  => null,
            'token_exp'           => null,
        ]);

        return redirect()->route('cliente.dashboard')
            ->with('success', '¡Correo verificado! Bienvenido al spa.');
    }

    public function reenviar(Request $request): RedirectResponse
    {
        $user = $request->user();

        $codigo = self::generarCodigo($user);

        return back()->with('status', 'Código reenviado. Revisa tu correo.');
    }

    public static function generarCodigo($user): string
    {
        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'token_verificacion' => $codigo,
            'token_exp'          => now()->addMinutes(15),
        ])->saveQuietly();

        Mail::raw(
            "Hola {$user->nombre},\n\nTu código de verificación de correo es:\n\n   {$codigo}\n\nVálido por 15 minutos.\n\nSi no creaste esta cuenta, ignora este mensaje.",
            fn($m) => $m->to($user->correo)->subject('Código de verificación — Spa')
        );

        return $codigo;
    }
}
