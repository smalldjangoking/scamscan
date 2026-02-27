#!/bin/sh
set -e

echo "➡️ Применение миграций базы данных (Alembic)..."
alembic upgrade head

echo "➡️ Запуск Uvicorn сервера..."

exec uvicorn main:app --host 0.0.0.0 --port 443 --ssl-certfile /certs/cert.pem --ssl-keyfile /certs/key.pem
