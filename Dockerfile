FROM node:latest
MAINTAINER Olivier Cartier <cestoliv@chevro.fr>

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY package.json /app
RUN npm install

COPY server.js /app
COPY config.json /app

EXPOSE 80
CMD [ "npm", "start" ]