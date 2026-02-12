# Instrucciones de Despliegue con Nginx Proxy Manager (NPM)

Esta guía asume que ya tienes un VPS con **Docker**, **Docker Compose** y **Nginx Proxy Manager** instalados y funcionando.

## 1. Preparación en el VPS

1.  **Conéctate a tu VPS**:
    ```bash
    ssh usuario@tu-ip-vps
    ```

2.  **Crea la carpeta del proyecto**:
    ```bash
    mkdir -p ~/projects/matteosalvatore
    cd ~/projects/matteosalvatore
    ```

3.  **Crea el archivo de variables de entorno (`.env`)**:
    Este paso es **crítico**. No subas tu `.env` local. Crea uno nuevo con los secretos de producción.
    ```bash
    nano .env
    ```
    Pega el contenido equivalente a tu `production.env` (usando los valores reales de Supabase, Culqi, etc.).
    
    > **Nota**: Asegúrate de que `NEXT_PUBLIC_API_URL` sea `https://matteosalvatore.pe/api`.

## 2. Despliegue de la Aplicación

1.  **Sube o actualiza los archivos**:
    Si usas git (recomendado):
    ```bash
    git pull origin main
    ```
    Si subes manualmente, asegúrate de tener `docker-compose.prod.yml` y la carpeta `frontend` actualizada.

2.  **Levanta los servicios**:
    Usa el archivo de producción para levantar frontend (puerto 8010) y backend (puerto 4000).
    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```

## 3. Configuración de Nginx Proxy Manager (NPM)

Accede a tu panel de NPM (usualmente puerto 81) y agrega un nuevo Proxy Host.

### A. Configuración Principal (Frontend)
1.  Clic en **Add Proxy Host**.
2.  **Domain Names**: `matteosalvatore.pe`, `www.matteosalvatore.pe`
3.  **Scheme**: `http`
4.  **Forward Hostname / IP**: `172.17.0.1` (IP del host Docker gateway) o la IP pública de tu VPS.
5.  **Forward Port**: `8010`
6.  **Block Common Exploits**: Activalo.
7.  **SSL**: Request a new SSL Certificate (Let's Encrypt), activa "Force SSL" y "HTTP/2".

### B. Configuración de la API (Backend)
Para que `https://matteosalvatore.pe/api` funcione:

1.  Edita el Proxy Host que acabas de crear.
2.  Ve a la pestaña **Custom Locations**.
3.  Clic en **Add Location**:
    - **Define Location**: `/api`
    - **Scheme**: `http`
    - **Forward Host**: `172.17.0.1` (Igual que arriba)
    - **Forward Port**: `4000`
4.  Guardar.

## 4. Verificación
Visita `https://matteosalvatore.pe`.
Prueba endpoints de la API (ej. login) para asegurar la conexión.

---

### Nota sobre archivos antiguos
Puedes ignorar o eliminar los archivos `nginx/` y `init-letsencrypt.sh` del repositorio, ya que eran para una configuración manual de Nginx que **NPM** reemplaza completamente.
