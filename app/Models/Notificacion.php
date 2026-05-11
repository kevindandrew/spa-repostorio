<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    use HasUuids;

    protected $table = 'notificaciones';

    public $timestamps = false;

    protected $fillable = [
        'cita_id',
        'usuario_id',
        'tipo',
        'canal',
        'estado',
        'enviado_en',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'enviado_en' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
