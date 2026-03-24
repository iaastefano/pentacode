#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# backup.sh — Backup diario de SQLite + uploads
#
# Agregar al crontab:
#   0 3 * * * /var/www/pentacode/backup.sh >> /var/log/pentacode-backup.log 2>&1
# ===================================================================

APP_DIR="/var/www/pentacode"
BACKUP_DIR="/var/backups/pentacode"
RETENTION_DAYS=14
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "[${DATE}] Iniciando backup..."

if [ -f "$APP_DIR/prisma/prod.db" ]; then
  sqlite3 "$APP_DIR/prisma/prod.db" ".backup '$BACKUP_DIR/db_${DATE}.sqlite'"
  echo "  DB copiada: db_${DATE}.sqlite"
fi

if [ -d "$APP_DIR/public/uploads" ]; then
  tar czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" -C "$APP_DIR/public" uploads
  echo "  Uploads: uploads_${DATE}.tar.gz"
fi

find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete
echo "  Limpieza: eliminados backups > ${RETENTION_DAYS} días."
echo "[${DATE}] Backup completo."
