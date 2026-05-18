<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes_paquete', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignUuid('paquete_id')->constrained('paquetes')->cascadeOnDelete();
            $table->text('notas')->nullable();
            $table->enum('estado', ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'])->default('PENDIENTE');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_paquete');
    }
};
