FROM python:3.13-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
COPY Pipfile Pipfile.lock ./
RUN pip install pipenv --no-cache-dir pipenv
RUN pipenv sync --system

COPY . .

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]