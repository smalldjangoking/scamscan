FROM python:3.13.3-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock ./
COPY . .

RUN pip install pipenv --no-cache-dir pipenv
RUN pipenv sync --system



CMD ["fastapi", "run", "main.py", "--port", "443", "--ssl-certfile", "/certs/cert.pem", "--ssl-keyfile", "/certs/key.pem"]