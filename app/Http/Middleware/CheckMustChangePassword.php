<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMustChangePassword
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            auth()->check() &&
            auth()->user()->debe_cambiar_password &&
            !$request->routeIs('password.change', 'password.change.update', 'logout')
        ) {
            return redirect()->route('password.change');
        }

        return $next($request);
    }
}
