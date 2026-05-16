<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Paquete extends Model
{
    use HasUuids;

    protected $table = 'paquetes';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'fecha_inicio',
        'fecha_fin',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio'       => 'decimal:2',
            'fecha_inicio' => 'date',
            'fecha_fin'    => 'date',
            'activo'       => 'boolean',
        ];
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'paquete_servicio');
    }

    public function estaVigente(): bool
    {
        $hoy = now()->startOfDay();
        return $this->activo
            && $this->fecha_inicio->lte($hoy)
            && $this->fecha_fin->gte($hoy);
    }
}
