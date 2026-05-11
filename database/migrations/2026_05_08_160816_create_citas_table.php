<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('cliente_id');
            $table->uuid('empleado_id');
            $table->uuid('servicio_id');
            $table->dateTime('fecha_hora_inicio');
            $table->dateTime('fecha_hora_fin');
            $table->enum('estado', ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO'])
                  ->default('PENDIENTE');
            $table->decimal('precio_cobrado', 10, 2)->nullable();
            $table->text('notas_cliente')->nullable();
            $table->text('notas_empleado')->nullable();
            $table->timestamps();

            $table->foreign('cliente_id')
                ->references('id')->on('clientes')
                ->onDelete('restrict');

            $table->foreign('empleado_id')
                ->references('id')->on('empleados')
                ->onDelete('restrict');

            $table->foreign('servicio_id')
                ->references('id')->on('servicios')
                ->onDelete('restrict');

            $table->index(['empleado_id', 'fecha_hora_inicio', 'fecha_hora_fin']);
            $table->index(['cliente_id', 'fecha_hora_inicio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
