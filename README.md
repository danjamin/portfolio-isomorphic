# portfolio

Portfolio written in isomorphic React


## One time setup

- Install docker toolbox
- Install git

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

Visit dev site at `<machine_ip>:8000`


## Watchers / Change, reload page

The whole app in dev is configured with polling inside docker so that
a change will trigger a rebuild of client side code and server side when necessary.

No need to manually restart the docker container -- unless something strange happens.


## Generating vendor.js

Every once in a while, an external dependency will need updating locally.
To generate `public/vendor.js`

```
$ docker exec -it portfolio_web_1 bash
# grunt browserify:vendor
```

## Debugging server side web

Run `node-inspector` in the web container
Note: `--preload false` is insanely faster!

```
$ docker exec -it portfolio_web_1 bash
# node-inspector --preload false
```

Navigate to remote debugger in chrome `<machine_ip>:8080`

Debug as usual (e.g. visit `<machine_ip>:8001`, set breakpoints, etc.)
