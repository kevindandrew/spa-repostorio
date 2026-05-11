<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaServicio extends Model
{
    use HasUuids;

    protected $table = 'categorias_servicio';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function servicios(): HasMany
    {
        return $this->hasMany(Servicio::class, 'categoria_id');
    }
}
