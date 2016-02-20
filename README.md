# portfolio-isomorphic

Portfolio written in isomorphic React


## One time setup

- Install git
- Install docker toolbox (or docker and docker-compose)

Launch Docker Toolbox

Note: with docker compose, you should be able to leverage a single docker machine
across projects.


## Running

Set the `default` docker machine active (if not already):

```
$ eval $(docker-machine env default)
```

Leverage docker compose to bring up the dev server:

```
$ docker-compose up -d
```

Figure out machine IP (Windows/OS X only) -- linux can use localhost:

```
$ docker-machine ip default
```

Visit dev site at `<machine_ip>`


## Watchers / Change, reload page

The whole app in dev is configured with polling inside docker so that
a change will trigger a rebuild of client side code and server side when necessary.

No need to manually restart the docker container -- unless something strange happens.


## Generating vendor.js

Every once in a while, an external dependency will need updating locally.
To generate `public/vendor.js`

```
$ docker exec -it <web_container_id> bash
# grunt browserify:vendor-dev
```

## Debugging server side web

In dev, `node-inspector` is already running in the web container
Navigate to remote debugger in chrome `<machine_ip>:8080`
Debug as usual (e.g. visit `<machine_ip>`, set breakpoints, etc.)

**Note**: be sure to remove all breakpoints after debugging, or you will get
stuck on the next reload of the page -- then you will have to restart the web
container!

## Versioning

```
$ docker cp ~/.gitconfig <web_container_id>:/root/.gitconfig
$ docker exec <web_container_id> npm version {patch|minor|major}
$ git push
$ git push origin --tags
```

## Deploying to cloud front

Setup an S3 bucket then setup cloud front with the origin set to your bucket

### Get the container running with the correct ENV

```
$ git checkout tags/0.1.0
$ docker run -d --name deploy-to-cdn -v $(pwd):/usr/src/app \
--env CDN_HOST=foo123.cloudfront.net \
--env S3_BUCKET=bucket \
--env S3_REGION=us-west-1 \
--env S3_ACCESS_KEY_ID=id \
--env S3_SECRET_ACCESS_KEY=secret \
danjamin/portfolio-isomorphic-web tail -f
```

### Install deps, build, and deploy

```
$ docker exec deploy-to-cdn npm install
$ docker exec deploy-to-cdn npm prune
$ docker exec deploy-to-cdn grunt production
$ docker exec deploy-to-cdn grunt s3:prod
```

## Deploying to AWS

Get AWS setup see [AWS Example](https://docs.docker.com/machine/examples/aws/)
and the `docker-machine` created.

Be sure port 80 is open on your EC2 instance.

### Make sure we are on the right docker machine

```
$ eval $(docker-machine env aws-sandbox)
```

### Get web_1 running

```
$ docker run --name web_1 -d \
-w /usr/src/app \
--env NODE_ENV=production \
--env PORT=8000 \
--env CDN_HOST=foo123.cloudfront.net \
danjamin/portfolio-isomorphic-web node --harmony_destructuring server.js
```

### Repeat for web_2

### Get nginx up

```
$ git checkout tags/0.1.0
$ docker run --name nginx -d -p 80:80 \
--link web_1:web_1 \
--link web_2:web_2 \
nginx:1.9
$ docker cp nginx/nginx.conf nginx:/etc/nginx/nginx.conf
$ docker cp nginx/upstream.conf nginx:/etc/nginx/conf.d/upstream.conf
$ docker restart nginx
```

### Deploy the newest version to web_1

```
$ docker exec web_1 bash -c "\
cd ../builds && \
rm -Rf master && \
git clone https://github.com/danjamin/portfolio-isomorphic.git 0.1.0 && \
cd 0.1.0 && \
git checkout tags/0.1.0 && \
npm i --production && \
rm -Rf /usr/src/app && \
ln -s /usr/src/builds/master /usr/src/app"
```

### Repeat for web_2

### Restart web containers

```
$ docker restart web_1 web_2
```
