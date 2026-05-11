<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empleados', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuario_id')->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('especialidad', 100)->nullable();
            $table->text('bio')->nullable();
            $table->string('foto_url', 500)->nullable();
            $table->date('fecha_contratacion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('usuario_id')
                ->references('id')->on('usuarios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
