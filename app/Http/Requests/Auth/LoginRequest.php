<?php

namespace App\Http\Requests\Auth;

use App\Models\Usuario;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $user = Usuario::where('correo', $this->email)->first();

        // Verificar si la cuenta está bloqueada
        if ($user && $user->bloqueado_hasta && now()->isBefore($user->bloqueado_hasta)) {
            $segundos = now()->diffInSeconds($user->bloqueado_hasta);
            $minutos  = (int) ceil($segundos / 60);
            throw ValidationException::withMessages([
                'email' => "Tu cuenta está bloqueada por múltiples intentos fallidos. Intenta de nuevo en {$minutos} minuto(s) o contacta al administrador.",
            ]);
        }

        if (! Auth::attempt(['correo' => $this->email, 'password' => $this->password], $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            if ($user) {
                $intentos = ($user->intentos_fallidos ?? 0) + 1;
                $update   = ['intentos_fallidos' => $intentos];

                if ($intentos >= 5) {
                    $update['bloqueado_hasta'] = now()->addMinutes(30);
                }

                $user->forceFill($update)->saveQuietly();

                if ($intentos >= 5) {
                    throw ValidationException::withMessages([
                        'email' => 'Cuenta bloqueada por 30 minutos debido a demasiados intentos fallidos. Contacta al administrador si necesitas acceso inmediato.',
                    ]);
                }

                $restantes = 5 - $intentos;
                throw ValidationException::withMessages([
                    'email' => "Credenciales incorrectas. Te quedan {$restantes} intento(s) antes de que la cuenta sea bloqueada.",
                ]);
            }

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // Login exitoso — resetear contador
        if ($user) {
            $user->forceFill([
                'intentos_fallidos' => 0,
                'bloqueado_hasta'   => null,
            ])->saveQuietly();
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
