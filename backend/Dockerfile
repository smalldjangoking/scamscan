FROM python:3.13.3-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock ./
COPY . .

RUN pip install pipenv --no-cache-dir pipenv
RUN pipenv sync --system

CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 443 --ssl-certfile /certs/cert.pem --ssl-keyfile /certs/key.pem"]