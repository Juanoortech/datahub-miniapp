################################
# PYTHON-BASE
################################
FROM python:3.12-slim AS python-base

ENV PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

COPY requirements.txt .
RUN apt-get update
RUN pip install -r requirements.txt

################################
# DEVELOPMENT
################################
FROM python-base AS development
WORKDIR /app
CMD jurigged -m bot

################################
# PRODUCTION
################################
FROM python-base AS prod
COPY . /app/bot
WORKDIR /app
CMD python -m bot