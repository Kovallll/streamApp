FROM node:20.9.0-alpine 

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

EXPOSE 8080

RUN yarn install --no-cache

COPY ./ ./

RUN yarn build

CMD ["yarn", "start"]