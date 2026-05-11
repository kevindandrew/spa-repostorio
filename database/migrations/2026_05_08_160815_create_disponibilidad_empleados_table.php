<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disponibilidad_empleados', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('empleado_id');
            $table->tinyInteger('dia_semana'); // 0=Domingo ... 6=Sábado
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('empleado_id')
                ->references('id')->on('empleados')
                ->onDelete('cascade');

            $table->index(['empleado_id', 'dia_semana']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disponibilidad_empleados');
    }
};
