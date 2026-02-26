#!/bin/sh
set -e

echo "Waiting for Postgres..."
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  sleep 1
done

echo "Applying Alembic migrations..."
alembic upgrade head

echo "Starting Uvicorn..."
uvicorn main:app --host 0.0.0.0 --port 443 --ssl-certfile /certs/cert.pem --ssl-keyfile /certs/key.pem