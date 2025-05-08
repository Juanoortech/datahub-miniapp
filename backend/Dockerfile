################################
# PYTHON-BASE
################################
FROM python:3.12-slim AS python-base

ENV PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

################################
# DEVELOPMENT
################################
FROM python-base AS development
CMD python manage.py makemigrations && python manage.py migrate && jurigged manage.py runserver 0.0.0.0:8000

################################
# PRODUCTION
################################
FROM python-base AS prod
COPY . .
CMD python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && uvicorn core.asgi:application --port=8000 --host=0.0.0.0 --workers=1 --lifespan off