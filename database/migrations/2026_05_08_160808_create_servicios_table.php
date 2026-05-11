<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('categoria_id');
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->integer('duracion_minutos');
            $table->decimal('precio', 10, 2);
            $table->string('imagen_url', 500)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('categoria_id')
                ->references('id')->on('categorias_servicio')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
