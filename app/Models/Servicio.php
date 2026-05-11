<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Servicio extends Model
{
    use HasUuids;

    protected $fillable = [
        'categoria_id',
        'nombre',
        'descripcion',
        'duracion_minutos',
        'precio',
        'imagen_url',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio'  => 'decimal:2',
            'activo'  => 'boolean',
        ];
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaServicio::class, 'categoria_id');
    }

    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'servicio_id');
    }
}
