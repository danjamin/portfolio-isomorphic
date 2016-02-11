FROM node:5.5

# Install Ruby and rsync
RUN \
  apt-get update && \
  apt-get install -y ruby rsync

# Install sass gem
RUN gem install --no-ri --no-rdoc sass

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g grunt-cli nodemon node-inspector
