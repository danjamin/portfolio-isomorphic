FROM node:5.6

RUN mkdir -p /usr/src/app /usr/src/builds
COPY server.js /usr/src/app
WORKDIR /usr/src/app
ENV PORT 8000

# Install Ruby and rsync
RUN \
  apt-get update && \
  apt-get install -y ruby rsync
RUN gem install --no-ri --no-rdoc sass
RUN npm install -g grunt-cli nodemon node-inspector
