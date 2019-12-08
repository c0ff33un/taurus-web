FROM node:12.7.0-stretch as builder

COPY ./package.json /app/

COPY ./package-lock.json /app/

WORKDIR /app

RUN npm install

COPY . /app

RUN npm run build

FROM node:12.7.0-alpine

RUN npm install -g serve

COPY --from=builder /app/build/ ./build

CMD ["serve", "-s", "build"]
