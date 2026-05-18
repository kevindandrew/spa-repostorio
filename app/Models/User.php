<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
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
    use HasFactory, HasUuids, Notifiable, SoftDeletes;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'correo',
        'password',
        'rol',
        'correo_verificado',
        'activo',
        'debe_cambiar_password',
        'token_verificacion',
        'token_exp',
        'intentos_fallidos',
        'bloqueado_hasta',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'              => 'hashed',
            'correo_verificado'     => 'boolean',
            'activo'                => 'boolean',
            'debe_cambiar_password' => 'boolean',
            'token_exp'             => 'datetime',
            'bloqueado_hasta'       => 'datetime',
        ];
    }

    public function getEmailAttribute(): string
    {
        return $this->correo;
    }

    public function getEmailForPasswordReset(): string
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
