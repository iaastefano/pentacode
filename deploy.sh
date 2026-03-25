#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# deploy.sh — Despliegue de Pentacode en VPS DonWeb
#
# Uso inicial (una sola vez):
#   chmod +x deploy.sh && ./deploy.sh setup
#
# Despliegues posteriores:
#   ./deploy.sh update
# ===================================================================

APP_DIR="/var/www/pentacode"
REPO_URL="https://github.com/iaastefano/pentacode.git"
BRANCH="main"
NODE_VERSION="20"

setup() {
  echo "==> Instalando dependencias del sistema..."
  sudo apt-get update
  sudo apt-get install -y curl git nginx certbot python3-certbot-nginx

  if ! command -v node &>/dev/null; then
    echo "==> Instalando Node.js ${NODE_VERSION} via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
  fi

  if ! command -v pm2 &>/dev/null; then
    echo "==> Instalando PM2..."
    npm install -g pm2
    pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true
  fi

  echo "==> Clonando repo..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER":"$USER" "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR" || echo "Repo ya existe, saltando clone."

  echo "==> Copiá .env.production.example a .env en ${APP_DIR} y completá los valores."
  echo "==> Luego ejecutá: ./deploy.sh update"
}

update() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  cd "$APP_DIR"

  echo "==> Bajando cambios..."
  git fetch origin "$BRANCH"
  git reset --hard "origin/$BRANCH"

  echo "==> Instalando dependencias..."
  npm ci --omit=dev
  npx prisma generate

  echo "==> Migrando base de datos..."
  npx prisma db push --accept-data-loss

  echo "==> Build de producción..."
  npm run build

  echo "==> Reiniciando proceso..."
  pm2 startOrRestart ecosystem.config.js
  pm2 save

  echo "==> Deploy completo."
}

ssl() {
  echo "==> Configurando SSL con certbot..."
  sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com --non-interactive --agree-tos -m tu-email@ejemplo.com
  sudo systemctl reload nginx
  echo "==> SSL configurado. Renovación automática activa."
}

seed() {
  cd "$APP_DIR"
  echo "==> Ejecutando seed (requiere tsx como devDep o npx)..."
  npx tsx prisma/seed.ts
  echo "==> Seed completo."
}

case "${1:-help}" in
  setup)  setup ;;
  update) update ;;
  ssl)    ssl ;;
  seed)   seed ;;
  *)
    echo "Uso: $0 {setup|update|ssl|seed}"
    echo "  setup  — Instalación inicial del servidor"
    echo "  update — Despliegue de nueva versión"
    echo "  ssl    — Configurar HTTPS con Let's Encrypt"
    echo "  seed   — Ejecutar seed de base de datos"
    exit 1
    ;;
esac
