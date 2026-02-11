# Deployment Guide

This guide describes how to deploy the matteosalvatore.pe application to a VPS.

## Prerequisites

- A VPS (Virtual Private Server) with Ubuntu 20.04 or later.
- Docker and Docker Compose installed on the VPS.
- Domain `matteosalvatore.pe` and `www.matteosalvatore.pe` pointing to the VPS IP address.

## Initial Setup

1. **SSH into your VPS:**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd matteosalvatore
   ```

3. **Install Docker and Docker Compose:**
   (If not already installed)
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose-plugin
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory with your production secrets. You can copy the example and fill in the values:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Ensure all required variables (SUPABASE keys, CULQI keys, etc.) are set.*
   
   **IMPORTANT:**
   The `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` are hardcoded to `https://matteosalvatore.pe` in `docker-compose.prod.yml`. If this changes, update `docker-compose.prod.yml`.

## Deployment

1. **Make the init script executable:**
   ```bash
   chmod +x init-letsencrypt.sh
   ```

2. **Run the initialization script:**
    This script will:
    - Download recommended TLS parameters.
    - Generate dummy certificates to pass Nginx validation.
    - Start Nginx.
    - Request real Let's Encrypt certificates.
    - Reload Nginx.
    
   ```bash
   sudo ./init-letsencrypt.sh
   ```

3. **Verify Deployment:**
   - Visit `https://matteosalvatore.pe`.
   - Check if the site loads with a valid SSL certificate.
   - Test api endpoints.

## Maintenance

- **Updating the Application:**
  ```bash
  git pull
  docker compose -f docker-compose.prod.yml up -d --build
  ```

- **Viewing Logs:**
  ```bash
  docker compose -f docker-compose.prod.yml logs -f
  ```

- **Renewing Certificates:**
  Certbot is configured to renew certificates automatically. However, you can force renewal with:
  ```bash
  docker compose -f docker-compose.prod.yml run --rm certbot renew
  ```
