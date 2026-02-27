#!/bin/sh
set -e

echo "➡️ Starting Alembic migrations..."
alembic upgrade head

echo "➡️ Starting Uvicorn server..."

exec uvicorn main:app --host 0.0.0.0 --port 443 --ssl-certfile /certs/cert.pem --ssl-keyfile /certs/key.pem
