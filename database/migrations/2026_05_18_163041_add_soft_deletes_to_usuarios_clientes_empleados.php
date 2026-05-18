<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->softDeletes()->after('bloqueado_hasta');
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
