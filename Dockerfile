FROM node:20.6.0

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY src/ ./src
COPY .env ./
COPY .env.example ./

CMD [ "yarn", "start" ]