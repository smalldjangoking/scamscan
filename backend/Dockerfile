FROM python:3.13-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock ./
COPY . .

RUN pip install pipenv --no-cache-dir pipenv
RUN pipenv sync --system
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]