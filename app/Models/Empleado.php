<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    use HasUuids;

    protected $fillable = [
        'usuario_id',
        'telefono',
        'especialidad',
        'bio',
        'foto_url',
        'fecha_contratacion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo'             => 'boolean',
            'fecha_contratacion' => 'date',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function disponibilidades(): HasMany
    {
        return $this->hasMany(DisponibilidadEmpleado::class, 'empleado_id');
    }

    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'empleado_id');
    }

    public function resenas(): HasMany
    {
        return $this->hasMany(Resena::class, 'empleado_id');
    }
}
