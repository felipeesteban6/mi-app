# Contexto del proyecto — mi-app

Instrucciones y contexto para asistentes de IA (Claude Code) que trabajen en este
proyecto. Responder siempre en **español**, con enfoque técnico y práctico, priorizando
**seguridad, rendimiento y mantenibilidad**.

## Qué es

Aplicación web **Laravel 10** con frontend **Vue 3 + Vite 5 + Tailwind 4** (SPA/componentes
integrados vía `laravel-vite-plugin`). Repositorio público en GitHub:
`https://github.com/felipeesteban6/mi-app`.

## Stack técnico

- **Backend:** PHP 8.3, Laravel 10 (`laravel/framework: ^10.10`), Sanctum, Tinker.
- **Frontend:** Vue 3.5, Vite 5, Tailwind 4, Axios. Build con `npm run build` (script `vite build`).
- **Base de datos:** MariaDB 10.11 (driver `mysql`). Base y usuario: `miapp`.
- **Gestores:** Composer 2.x, Node 20 / npm 10.

## Convenciones de código

- Seguir las buenas prácticas modernas de Laravel: Form Requests para validación,
  Eloquent con relaciones bien definidas, evitar consultas N+1 (usar eager loading),
  inyección de dependencias, y controladores delgados (lógica en servicios/acciones).
- En Vue, priorizar **componentes reutilizables** y validación tanto en cliente como en servidor.
- Nunca confiar solo en validación de frontend: toda entrada se valida también en el backend.
- En operaciones sensibles considerar auditoría, permisos e integridad de datos (transacciones).

## Entorno de producción (servidor)

Servidor **Oracle Cloud — Always Free**, VM AMD `VM.Standard.E2.1.Micro`
(1 GB RAM + 2 GB swap), Ubuntu 24.04. Servido con Nginx + PHP-FPM 8.3.

- **Ruta del proyecto:** `/var/www/miapp`
- **Document root de Nginx:** `/var/www/miapp/public` (NUNCA la raíz del proyecto)
- **IP pública:** `129.213.165.120` (acceso por HTTP; SSL pendiente, requiere dominio)
- **Usuario del sistema:** `ubuntu` (dueño del código); Nginx/PHP-FPM corren como `www-data`
- **Socket PHP-FPM:** `unix:/var/run/php/php8.3-fpm.sock`
- **Servicios:** `nginx`, `php8.3-fpm`, `mariadb` (todos habilitados al arranque)
- **Config del sitio:** `/etc/nginx/sites-available/miapp`

### Despliegue

Actualizar producción con el script `deploy.sh` en la raíz del proyecto:
`cd /var/www/miapp && ./deploy.sh`. Hace: git pull, composer install, npm build,
migraciones, re-cache de config/rutas/vistas, permisos y reload de PHP-FPM.

### Diagnóstico rápido

- Estado: `sudo systemctl status nginx php8.3-fpm mariadb`
- Memoria/swap: `free -h`  ·  Disco: `df -h`
- Logs app: `tail -n 50 /var/www/miapp/storage/logs/laravel.log`
- Logs Nginx: `sudo tail -n 50 /var/log/nginx/error.log`

## Reglas de seguridad (IMPORTANTES)

- **Nunca** commitear ni exponer: `.env`, la clave SSH privada, contraseñas de base de datos,
  tokens o el `APP_KEY`. El `.env` está (y debe seguir) en `.gitignore`.
- **Nunca** pegar el contenido de `.env` ni credenciales en chats o logs compartidos.
- En producción: `APP_ENV=production` y `APP_DEBUG=false` siempre.
- El usuario de base de datos tiene privilegios solo sobre su base y escucha solo en `localhost`.
- Antes de ejecutar comandos que modifiquen el servidor de producción, mostrar el cambio y
  confirmar. No hacer operaciones destructivas (borrar datos, DROP, rm -rf) sin confirmación explícita.
- No abrir puertos ni cambiar reglas de firewall/Security List sin avisar el impacto.

## Pendientes conocidos

- **SSL/HTTPS:** falta; requiere un dominio apuntando a la IP para emitir certificado con Certbot.
- **Reinicio de kernel:** hay un kernel actualizado pendiente de cargar (`sudo reboot` cuando se pueda).
- **Colas:** aún sin Supervisor; si se añaden jobs, configurar un worker con Supervisor.
- **Base de datos:** hoy es MariaDB. A futuro se evaluó migrar a Oracle Autonomous DB
  (requiere Instant Client + extensión OCI8 + `yajra/laravel-oci8`).
