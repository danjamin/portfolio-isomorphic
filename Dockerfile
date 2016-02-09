FROM node:5.5

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN npm install -g grunt-cli nodemon node-inspector
