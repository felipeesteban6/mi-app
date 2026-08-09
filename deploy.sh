#!/usr/bin/env bash
#
# deploy.sh — Actualiza la app Laravel en el servidor Oracle Cloud.
#
# Uso (dentro del servidor, en la raíz del proyecto):
#   cd /var/www/miapp
#   ./deploy.sh
#
# Qué hace: baja el código nuevo de GitHub, reinstala dependencias,
# recompila el frontend (Vite), corre migraciones, re-cachea la
# configuración y recarga PHP-FPM. Deja la app en mantenimiento
# mientras dura el proceso para evitar estados a medias.
#
# Requisitos: ejecutarlo como el usuario dueño del código (ubuntu).
# Los comandos con sudo (permisos y reload) pedirán elevación sin contraseña.

set -euo pipefail

# --- Configuración -----------------------------------------------------------
APP_DIR="/var/www/miapp"
PHP_FPM="php8.3-fpm"
BRANCH="main"                      # cambia a 'master' si tu rama principal se llama así
# -----------------------------------------------------------------------------

echo "==> Desplegando en ${APP_DIR} (rama ${BRANCH})"
cd "${APP_DIR}"

# 1. Modo mantenimiento (si falla porque la app aún no arranca, no aborta el deploy)
php artisan down --render="errors::503" || true

# 2. Traer el código nuevo
echo "==> git pull"
git fetch origin "${BRANCH}"
git reset --hard "origin/${BRANCH}"   # descarta cambios locales accidentales en el server

# 3. Dependencias PHP (solo producción, autoloader optimizado)
echo "==> composer install"
composer install --no-dev --optimize-autoloader --no-interaction

# 4. Frontend: dependencias + build de Vite
#    NODE_OPTIONS limita el heap por si la Micro de 1 GB se queda corta de RAM.
echo "==> npm ci + build"
npm ci
NODE_OPTIONS="--max-old-space-size=768" npm run build

# 5. Migraciones (idempotentes; --force porque estamos en producción)
echo "==> migraciones"
php artisan migrate --force

# 6. Limpiar y regenerar cachés de producción
echo "==> optimize"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Reiniciar workers de cola (si algún día agregas Supervisor, esto los recarga)
php artisan queue:restart || true

# 8. Permisos correctos para www-data sobre lo que Laravel escribe en runtime
echo "==> permisos"
sudo chown -R www-data:www-data "${APP_DIR}/storage" "${APP_DIR}/bootstrap/cache"

# 9. Recargar PHP-FPM para que tome el código y la config nuevos
#    (necesario porque OPcache puede cachear los archivos viejos)
sudo systemctl reload "${PHP_FPM}"

# 10. Salir de mantenimiento
php artisan up

echo "==> Despliegue completado correctamente."
