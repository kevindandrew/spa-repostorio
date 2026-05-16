<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class VerificarDosFactoresController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if (!$request->session()->has('2fa_pending_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerificarDosFactores', [
            'correo' => $request->session()->get('2fa_pending_correo'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|size:6',
        ]);

        $pendingId = $request->session()->get('2fa_pending_id');

        if (!$pendingId) {
            return redirect()->route('login');
        }

        $user = User::find($pendingId);

        if (
            !$user ||
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
            'token_verificacion' => null,
            'token_exp'          => null,
        ]);

        $request->session()->forget(['2fa_pending_id', '2fa_pending_correo']);

        Auth::login($user, $request->session()->get('2fa_remember', false));
        $request->session()->regenerate();
        $request->session()->forget('2fa_remember');

        return redirect()->route('empleado.dashboard');
    }

    public function reenviar(Request $request): RedirectResponse
    {
        $pendingId = $request->session()->get('2fa_pending_id');

        if (!$pendingId) {
            return redirect()->route('login');
        }

        $user = User::find($pendingId);

        if ($user) {
            self::enviarCodigo($user);
        }

        return back()->with('status', 'Código reenviado. Revisa tu correo.');
    }

    public static function enviarCodigo(User $user): void
    {
        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'token_verificacion' => $codigo,
            'token_exp'          => now()->addMinutes(15),
        ])->saveQuietly();

        Mail::raw(
            "Hola {$user->nombre},\n\nTu código de verificación en dos pasos es:\n\n   {$codigo}\n\nVálido por 15 minutos.\n\nSi no iniciaste sesión, ignora este mensaje.",
            fn($m) => $m->to($user->correo)->subject('Código 2FA — Spa')
        );
    }
}
