FROM node:12.7.0-alpine

COPY package.json package-lock.json /app

WORKDIR /app

RUN npm install --no-optional && npm cache clean --force

ENTRYPOINT ["npm", "start"]
