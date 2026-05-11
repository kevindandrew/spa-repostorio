<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tokens_recuperacion', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuario_id');
            $table->string('token', 255)->unique();
            $table->enum('tipo', ['VERIFICACION_CORREO', 'RECUPERAR_CONTRASENA']);
            $table->timestamp('expira_en');
            $table->boolean('usado')->default(false);
            $table->timestamp('created_at')->nullable();

            $table->foreign('usuario_id')
                ->references('id')->on('usuarios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tokens_recuperacion');
    }
};
