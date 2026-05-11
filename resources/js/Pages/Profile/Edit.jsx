import { Head, usePage } from '@inertiajs/react';
import AdminLayout    from '@/Layouts/AdminLayout';
import EmpleadoLayout from '@/Layouts/EmpleadoLayout';
import ClienteLayout  from '@/Layouts/ClienteLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm           from './Partials/UpdatePasswordForm';
import DeleteUserForm               from './Partials/DeleteUserForm';

const LAYOUTS = {
    ADMIN:    AdminLayout,
    EMPLEADO: EmpleadoLayout,
    CLIENTE:  ClienteLayout,
};

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const Layout = LAYOUTS[auth.user?.rol] ?? ClienteLayout;

    return (
        <Layout title="Mi Perfil">
            <Head title="Mi Perfil" />

            <div className="max-w-2xl mx-auto space-y-6">

                {/* Datos personales */}
                <div className="kpi-card">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Cambiar contraseña */}
                <div className="kpi-card">
                    <UpdatePasswordForm />
                </div>

                {/* Zona de peligro */}
                <div className="kpi-card border border-red-500/20">
                    <DeleteUserForm />
                </div>

            </div>
        </Layout>
    );
}
