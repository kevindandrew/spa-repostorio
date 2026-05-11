<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategoriasServicioSeeder::class,
            ServiciosSeeder::class,
            UsuariosSeeder::class,
            DisponibilidadEmpleadosSeeder::class,
            CitasSeeder::class,
            ResenasSeeder::class,
        ]);
    }
}
