<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre', 150)->nullable();
            $table->string('correo', 255)->unique();
            $table->string('password', 255);
            $table->enum('rol', ['ADMIN', 'CLIENTE', 'EMPLEADO']);
            $table->boolean('correo_verificado')->default(false);
            $table->boolean('activo')->default(true);
            $table->string('token_verificacion', 255)->nullable();
            $table->timestamp('token_exp')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('usuarios');
    }
};
