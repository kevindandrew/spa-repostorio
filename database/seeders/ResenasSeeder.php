<?php

namespace Database\Seeders;

use App\Models\Cita;
use App\Models\Resena;
use Illuminate\Database\Seeder;

class ResenasSeeder extends Seeder
{
    public function run(): void
    {
        $reseñas = [
            // Juan → María (Manicura básica, COMPLETADA)
            [
                'cliente_correo' => 'juan@cliente.com',
                'calificacion'   => 5,
                'comentario'     => 'Excelente servicio, María es increíble. Las uñas quedaron perfectas y duró toda la semana.',
            ],
            // Sofía → Carlos (Masaje relajante, COMPLETADA)
            [
                'cliente_correo' => 'sofia@cliente.com',
                'calificacion'   => 4,
                'comentario'     => 'El masaje fue muy relajante, Carlos es muy profesional. Le daría 5 estrellas si el local tuviera música más suave.',
            ],
        ];

        foreach ($reseñas as $data) {
            $cita = Cita::with(['cliente.usuario', 'resena'])
                ->whereHas('cliente.usuario', fn($q) => $q->where('correo', $data['cliente_correo']))
                ->where('estado', 'COMPLETADA')
                ->first();

            if ($cita && $cita->resena === null) {
                Resena::create([
                    'cita_id'      => $cita->id,
                    'cliente_id'   => $cita->cliente_id,
                    'empleado_id'  => $cita->empleado_id,
                    'calificacion' => $data['calificacion'],
                    'comentario'   => $data['comentario'],
                ]);
            }
        }
    }
}
