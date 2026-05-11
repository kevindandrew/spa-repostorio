<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\Empleado;
use App\Models\Cliente;

/**
 * Alias de Usuario para compatibilidad con los controladores de Breeze.
 * Toda la lógica de negocio está en App\Models\Usuario.
 */
class User extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'correo',
        'password',
        'rol',
        'correo_verificado',
        'activo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'          => 'hashed',
            'correo_verificado' => 'boolean',
            'activo'            => 'boolean',
        ];
    }

    // Breeze usa 'email' para mostrar el correo en vistas
    public function getEmailAttribute(): string
    {
        return $this->correo;
    }

    // Breeze/Auth usa 'email' para el login; lo mapeamos a 'correo'
    public function getAuthIdentifierName(): string
    {
        return 'correo';
    }

    public function empleado(): HasOne
    {
        return $this->hasOne(Empleado::class, 'usuario_id');
    }

    public function cliente(): HasOne
    {
        return $this->hasOne(Cliente::class, 'usuario_id');
    }
}
