#!/bin/sh
set -e

# Sustituir $PORT en la config de nginx y volcarla
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Crear el enlace de storage si no existe
php artisan storage:link --force 2>/dev/null || true

# Migraciones y caché de Laravel
php artisan migrate --force

# Seeders: solo corren si RUN_SEEDERS=true (remover la variable después del primer deploy)
if [ "$RUN_SEEDERS" = "true" ]; then
    echo "==> Corriendo seeders..."
    php artisan db:seed --force
    echo "==> Seeders completados."
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Iniciar nginx + php-fpm via supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
