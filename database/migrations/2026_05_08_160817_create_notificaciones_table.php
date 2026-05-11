<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('cita_id')->nullable();
            $table->uuid('usuario_id');
            $table->string('tipo', 50);
            $table->enum('canal', ['EMAIL', 'SMS', 'PUSH']);
            $table->enum('estado', ['PENDIENTE', 'ENVIADO', 'FALLIDO'])->default('PENDIENTE');
            $table->timestamp('enviado_en')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('cita_id')
                ->references('id')->on('citas')
                ->onDelete('set null');

            $table->foreign('usuario_id')
                ->references('id')->on('usuarios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
