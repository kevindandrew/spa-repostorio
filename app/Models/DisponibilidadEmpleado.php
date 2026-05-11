<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisponibilidadEmpleado extends Model
{
    use HasUuids;

    protected $table = 'disponibilidad_empleados';

    protected $fillable = [
        'empleado_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'dia_semana' => 'integer',
            'activo'     => 'boolean',
        ];
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }
}
