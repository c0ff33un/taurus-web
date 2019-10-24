FROM node:8.16.1-stretch

COPY . /web/	

RUN cd /web/ && \
    npm install

WORKDIR /web

CMD npm start
