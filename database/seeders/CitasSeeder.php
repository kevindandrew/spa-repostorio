<?php

namespace Database\Seeders;

use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Servicio;
use Illuminate\Database\Seeder;

class CitasSeeder extends Seeder
{
    public function run(): void
    {
        $clientes  = Cliente::with('usuario')->get()->keyBy(fn($c) => $c->usuario->correo);
        $empleados = Empleado::with('usuario')->get()->keyBy(fn($e) => $e->usuario->correo);
        $servicios = Servicio::all()->keyBy('nombre');

        $citas = [
            // Cita pasada COMPLETADA: Juan con Maria
            [
                'cliente_id'        => $clientes['juan@cliente.com']->id,
                'empleado_id'       => $empleados['maria@spa.com']->id,
                'servicio_id'       => $servicios['Manicura básica']->id,
                'fecha_hora_inicio' => now()->subDays(10)->setTime(10, 0),
                'fecha_hora_fin'    => now()->subDays(10)->setTime(10, 45),
                'estado'            => 'COMPLETADA',
                'precio_cobrado'    => $servicios['Manicura básica']->precio,
                'notas_empleado'    => 'Cliente satisfecha, solicitó esmalte rojo.',
            ],
            // Cita pasada COMPLETADA: Sofia con Carlos
            [
                'cliente_id'        => $clientes['sofia@cliente.com']->id,
                'empleado_id'       => $empleados['carlos@spa.com']->id,
                'servicio_id'       => $servicios['Masaje relajante 60 min']->id,
                'fecha_hora_inicio' => now()->subDays(5)->setTime(15, 0),
                'fecha_hora_fin'    => now()->subDays(5)->setTime(16, 0),
                'estado'            => 'COMPLETADA',
                'precio_cobrado'    => $servicios['Masaje relajante 60 min']->precio,
                'notas_cliente'     => 'Quisiera el mismo horario la próxima semana.',
            ],
            // Cita pasada CANCELADA: Luis con Ana
            [
                'cliente_id'        => $clientes['luis@cliente.com']->id,
                'empleado_id'       => $empleados['ana@spa.com']->id,
                'servicio_id'       => $servicios['Limpieza facial básica']->id,
                'fecha_hora_inicio' => now()->subDays(3)->setTime(11, 0),
                'fecha_hora_fin'    => now()->subDays(3)->setTime(12, 0),
                'estado'            => 'CANCELADA',
                'precio_cobrado'    => null,
                'notas_cliente'     => 'Cancelé por compromiso de último momento.',
            ],
            // Cita futura CONFIRMADA: Juan con Carlos
            [
                'cliente_id'        => $clientes['juan@cliente.com']->id,
                'empleado_id'       => $empleados['carlos@spa.com']->id,
                'servicio_id'       => $servicios['Masaje con piedras calientes']->id,
                'fecha_hora_inicio' => now()->addDays(3)->setTime(14, 0),
                'fecha_hora_fin'    => now()->addDays(3)->setTime(15, 15),
                'estado'            => 'CONFIRMADA',
                'precio_cobrado'    => $servicios['Masaje con piedras calientes']->precio,
            ],
            // Cita futura PENDIENTE: Sofia con Maria
            [
                'cliente_id'        => $clientes['sofia@cliente.com']->id,
                'empleado_id'       => $empleados['maria@spa.com']->id,
                'servicio_id'       => $servicios['Manicura con gel']->id,
                'fecha_hora_inicio' => now()->addDays(7)->setTime(9, 0),
                'fecha_hora_fin'    => now()->addDays(7)->setTime(10, 0),
                'estado'            => 'PENDIENTE',
                'precio_cobrado'    => $servicios['Manicura con gel']->precio,
            ],
        ];

        foreach ($citas as $data) {
            Cita::create($data);
        }
    }
}
