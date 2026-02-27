FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock ./
RUN pip install pipenv --no-cache-dir
RUN pipenv sync --system

COPY . .

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]