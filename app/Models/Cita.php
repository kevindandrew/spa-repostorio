<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cita extends Model
{
    use HasUuids;

    protected $fillable = [
        'cliente_id',
        'empleado_id',
        'servicio_id',
        'fecha_hora_inicio',
        'fecha_hora_fin',
        'estado',
        'precio_cobrado',
        'notas_cliente',
        'notas_empleado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_hora_inicio' => 'datetime',
            'fecha_hora_fin'    => 'datetime',
            'precio_cobrado'    => 'decimal:2',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }

    public function resena(): HasOne
    {
        return $this->hasOne(Resena::class, 'cita_id');
    }

    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class, 'cita_id');
    }
}
