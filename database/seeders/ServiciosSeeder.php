<?php

namespace Database\Seeders;

use App\Models\CategoriaServicio;
use App\Models\Servicio;
use Illuminate\Database\Seeder;

class ServiciosSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            // Uñas
            'Uñas' => [
                ['nombre' => 'Manicura básica',        'descripcion' => 'Limado, cutículas y esmalte clásico',           'duracion_minutos' => 45,  'precio' => 8.00],
                ['nombre' => 'Manicura con gel',        'descripcion' => 'Esmalte semipermanente de larga duración',      'duracion_minutos' => 60,  'precio' => 15.00],
                ['nombre' => 'Pedicura completa',       'descripcion' => 'Limpieza, exfoliación y esmalte en pies',       'duracion_minutos' => 60,  'precio' => 18.00],
                ['nombre' => 'Nail art',                'descripcion' => 'Diseños personalizados en uñas',                'duracion_minutos' => 90,  'precio' => 25.00],
            ],
            // Facial
            'Facial' => [
                ['nombre' => 'Limpieza facial básica',  'descripcion' => 'Limpieza profunda y extracción de impurezas',   'duracion_minutos' => 60,  'precio' => 25.00],
                ['nombre' => 'Hidratación facial',      'descripcion' => 'Tratamiento hidratante con mascarilla',         'duracion_minutos' => 75,  'precio' => 35.00],
                ['nombre' => 'Peeling facial',          'descripcion' => 'Exfoliación química para renovar la piel',      'duracion_minutos' => 60,  'precio' => 45.00],
            ],
            // Corporal
            'Corporal' => [
                ['nombre' => 'Exfoliación corporal',    'descripcion' => 'Eliminación de células muertas con sales marinas','duracion_minutos' => 60, 'precio' => 30.00],
                ['nombre' => 'Envoltura de barro',      'descripcion' => 'Tratamiento detox y reafirmante',               'duracion_minutos' => 90,  'precio' => 50.00],
                ['nombre' => 'Tratamiento anticelulítico','descripcion' => 'Masaje reductor y drenante',                  'duracion_minutos' => 60,  'precio' => 55.00],
            ],
            // Relajación
            'Relajación' => [
                ['nombre' => 'Masaje relajante 60 min', 'descripcion' => 'Masaje sueco de cuerpo completo',               'duracion_minutos' => 60,  'precio' => 35.00],
                ['nombre' => 'Masaje relajante 90 min', 'descripcion' => 'Masaje sueco extendido con aceites esenciales', 'duracion_minutos' => 90,  'precio' => 50.00],
                ['nombre' => 'Masaje con piedras calientes','descripcion' => 'Terapia con basalto volcánico',             'duracion_minutos' => 75,  'precio' => 60.00],
                ['nombre' => 'Reflexología podal',      'descripcion' => 'Masaje terapéutico en pies y tobillos',         'duracion_minutos' => 45,  'precio' => 28.00],
            ],
            // Depilación
            'Depilación' => [
                ['nombre' => 'Depilación cejas',        'descripcion' => 'Diseño y depilación con hilo o cera',           'duracion_minutos' => 15,  'precio' => 5.00],
                ['nombre' => 'Depilación piernas completas','descripcion' => 'Depilación con cera tibia',                 'duracion_minutos' => 45,  'precio' => 20.00],
                ['nombre' => 'Depilación axilas',       'descripcion' => 'Depilación con cera fría',                      'duracion_minutos' => 20,  'precio' => 10.00],
                ['nombre' => 'Depilación labio superior','descripcion' => 'Depilación con hilo o cera',                   'duracion_minutos' => 10,  'precio' => 4.00],
            ],
        ];

        foreach ($servicios as $categoriaNombre => $lista) {
            $categoria = CategoriaServicio::where('nombre', $categoriaNombre)->first();
            foreach ($lista as $data) {
                Servicio::create(array_merge($data, ['categoria_id' => $categoria->id]));
            }
        }
    }
}
