FROM node:5.5

# Install Ruby.
RUN \
  apt-get update && \
  apt-get install -y ruby

# Install sass gem
RUN gem install --no-ri --no-rdoc sass

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN grunt browserify:vendor
RUN npm install -g grunt-cli nodemon node-inspector
