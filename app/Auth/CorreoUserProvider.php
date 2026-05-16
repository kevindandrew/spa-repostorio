<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class CorreoUserProvider extends EloquentUserProvider
{
    // Mapea 'email' → 'correo' para que el broker de passwords encuentre al usuario
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $mapped = [];
        foreach ($credentials as $key => $value) {
            $mapped[$key === 'email' ? 'correo' : $key] = $value;
        }
        return parent::retrieveByCredentials($mapped);
    }
}
