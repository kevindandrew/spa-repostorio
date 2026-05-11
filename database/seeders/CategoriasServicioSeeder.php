<?php

namespace Database\Seeders;

use App\Models\CategoriaServicio;
use Illuminate\Database\Seeder;

class CategoriasServicioSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Uñas',       'descripcion' => 'Manicura, pedicura y nail art'],
            ['nombre' => 'Facial',     'descripcion' => 'Tratamientos faciales y limpieza de cutis'],
            ['nombre' => 'Corporal',   'descripcion' => 'Tratamientos corporales y exfoliaciones'],
            ['nombre' => 'Relajación', 'descripcion' => 'Masajes y terapias de relajación'],
            ['nombre' => 'Depilación', 'descripcion' => 'Depilación con cera, hilo y láser'],
        ];

        foreach ($categorias as $categoria) {
            CategoriaServicio::create($categoria);
        }
    }
}
