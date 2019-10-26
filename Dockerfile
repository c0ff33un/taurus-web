FROM node:12.7.0-stretch

COPY ./build/ /app/build/

WORKDIR /app

RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "build"]
