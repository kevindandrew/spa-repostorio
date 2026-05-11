<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasUuids, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'correo',
        'password',
        'rol',
        'correo_verificado',
        'activo',
        'token_verificacion',
        'token_exp',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'token_verificacion',
    ];

    protected function casts(): array
    {
        return [
            'password'           => 'hashed',
            'correo_verificado'  => 'boolean',
            'activo'             => 'boolean',
            'token_exp'          => 'datetime',
        ];
    }

    // Mapeo para que Laravel auth use 'correo' como campo de email
    public function getEmailForPasswordReset(): string
    {
        return $this->correo;
    }

    public function routeNotificationForMail(): string
    {
        return $this->correo;
    }

    public function cliente(): HasOne
    {
        return $this->hasOne(Cliente::class, 'usuario_id');
    }

    public function empleado(): HasOne
    {
        return $this->hasOne(Empleado::class, 'usuario_id');
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(TokenRecuperacion::class, 'usuario_id');
    }

    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class, 'usuario_id');
    }
}
