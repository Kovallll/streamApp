FROM node:20.9.0-alpine AS builder

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET_KEY=secret

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN npx prisma generate


RUN yarn install --no-cache

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start:prod"]