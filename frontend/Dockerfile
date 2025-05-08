################################
# BASE
################################
FROM node:18.17.1 AS node-base

WORKDIR /app

################################
# DEVELOPMENT
################################
FROM node-base AS node-development
CMD npm install && npm run build && npm run dev

################################
# PRODUCTION
################################
FROM node-base AS node-prod
COPY . .
CMD npm install && npm run start