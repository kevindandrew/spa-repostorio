<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuariosSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        Usuario::create([
            'nombre'            => 'Admin Spa',
            'correo'            => 'admin@spa.com',
            'password'          => Hash::make('password'),
            'rol'               => 'ADMIN',
            'correo_verificado' => true,
            'activo'            => true,
        ]);

        // Empleados
        $empleados = [
            [
                'usuario' => [
                    'nombre'            => 'Maria Lopez',
                    'correo'            => 'maria@spa.com',
                    'password'          => Hash::make('password'),
                    'rol'               => 'EMPLEADO',
                    'correo_verificado' => true,
                    'activo'            => true,
                ],
                'perfil' => [
                    'especialidad'      => 'Manicurista',
                    'fecha_contratacion'=> '2023-03-15',
                    'activo'            => true,
                ],
            ],
            [
                'usuario' => [
                    'nombre'            => 'Carlos Ruiz',
                    'correo'            => 'carlos@spa.com',
                    'password'          => Hash::make('password'),
                    'rol'               => 'EMPLEADO',
                    'correo_verificado' => true,
                    'activo'            => true,
                ],
                'perfil' => [
                    'especialidad'      => 'Masajista',
                    'fecha_contratacion'=> '2022-07-01',
                    'activo'            => true,
                ],
            ],
            [
                'usuario' => [
                    'nombre'            => 'Ana Torres',
                    'correo'            => 'ana@spa.com',
                    'password'          => Hash::make('password'),
                    'rol'               => 'EMPLEADO',
                    'correo_verificado' => true,
                    'activo'            => true,
                ],
                'perfil' => [
                    'especialidad'      => 'Esteticista',
                    'fecha_contratacion'=> '2024-01-10',
                    'activo'            => true,
                ],
            ],
        ];

        foreach ($empleados as $data) {
            $usuario = Usuario::create($data['usuario']);
            Empleado::create(array_merge($data['perfil'], ['usuario_id' => $usuario->id]));
        }

        // Clientes
        $clientes = [
            ['nombre' => 'Juan Perez',    'correo' => 'juan@cliente.com'],
            ['nombre' => 'Sofia Mendez',  'correo' => 'sofia@cliente.com'],
            ['nombre' => 'Luis Vargas',   'correo' => 'luis@cliente.com'],
        ];

        foreach ($clientes as $data) {
            $usuario = Usuario::create([
                'nombre'            => $data['nombre'],
                'correo'            => $data['correo'],
                'password'          => Hash::make('password'),
                'rol'               => 'CLIENTE',
                'correo_verificado' => true,
                'activo'            => true,
            ]);
            Cliente::create(['usuario_id' => $usuario->id]);
        }
    }
}
