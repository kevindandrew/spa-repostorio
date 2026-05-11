<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenRecuperacion extends Model
{
    use HasUuids;

    protected $table = 'tokens_recuperacion';

    public $timestamps = false;

    protected $fillable = [
        'usuario_id',
        'token',
        'tipo',
        'expira_en',
        'usado',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'expira_en'  => 'datetime',
            'usado'      => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function estaVigente(): bool
    {
        return !$this->usado && $this->expira_en->isFuture();
    }
}
