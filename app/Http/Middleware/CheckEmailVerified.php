<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEmailVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            auth()->check() &&
            auth()->user()->rol === 'CLIENTE' &&
            !auth()->user()->correo_verificado &&
            !$request->routeIs('verificar.correo', 'verificar.correo.store', 'verificar.correo.reenviar', 'logout')
        ) {
            return redirect()->route('verificar.correo');
        }

        return $next($request);
    }
}
