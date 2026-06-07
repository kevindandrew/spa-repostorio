# ── Stage 1: compilar assets de React/Vite ───────────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: imagen PHP de producción ────────────────────────────────────────
FROM php:8.2-fpm-alpine

# Dependencias del sistema
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    unzip \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    libxml2-dev \
    oniguruma-dev \
    gettext

# Extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mbstring \
        xml \
        dom \
        zip \
        bcmath \
        intl \
        opcache \
        gd

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Instalar dependencias PHP (capa de caché separada)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copiar el código fuente
COPY . .

# Copiar assets compilados del stage 1
COPY --from=frontend /app/public/build ./public/build

# Permisos de storage y caché
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Configuraciones de Docker
COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf    /etc/supervisord.conf
COPY docker/start.sh            /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
