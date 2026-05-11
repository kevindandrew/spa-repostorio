<?php

namespace Database\Seeders;

use App\Models\DisponibilidadEmpleado;
use App\Models\Empleado;
use Illuminate\Database\Seeder;

class DisponibilidadEmpleadosSeeder extends Seeder
{
    public function run(): void
    {
        $empleados = Empleado::all();

        // 1=Lunes ... 5=Viernes, 6=Sábado
        $horarioSemana  = ['hora_inicio' => '08:00:00', 'hora_fin' => '18:00:00'];
        $horarioSabado  = ['hora_inicio' => '09:00:00', 'hora_fin' => '14:00:00'];

        foreach ($empleados as $empleado) {
            // Lunes a Viernes
            foreach (range(1, 5) as $dia) {
                DisponibilidadEmpleado::create(array_merge($horarioSemana, [
                    'empleado_id' => $empleado->id,
                    'dia_semana'  => $dia,
                ]));
            }
            // Sábado
            DisponibilidadEmpleado::create(array_merge($horarioSabado, [
                'empleado_id' => $empleado->id,
                'dia_semana'  => 6,
            ]));
        }
    }
}
