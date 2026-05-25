<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'usuario_id',
        'telefono',
        'fecha_nacimiento',
        'preferencias',
        'alergias',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'cliente_id');
    }

    /**
     * Devuelve el nivel de fidelización y descuento aplicable.
     * Nivel 3 (VIP):       ≥ 12 meses → 15%
     * Nivel 2 (Frecuente): ≥  6 meses + 5 atenciones completadas → 10%
     * Nivel 1 (Regular):   ≥  3 meses + 2 atenciones completadas →  5%
     */
    public function nivelFidelizacion(): array
    {
        $meses       = (int) $this->created_at->diffInMonths(now());
        $completadas = $this->citas()->where('estado', 'COMPLETADA')->count();

        if ($meses >= 12) {
            return ['nivel' => 3, 'descuento' => 15, 'label' => 'VIP'];
        }
        if ($meses >= 6 && $completadas >= 5) {
            return ['nivel' => 2, 'descuento' => 10, 'label' => 'Frecuente'];
        }
        if ($meses >= 3 && $completadas >= 2) {
            return ['nivel' => 1, 'descuento' => 5, 'label' => 'Regular'];
        }

        return ['nivel' => 0, 'descuento' => 0, 'label' => null];
    }
}
