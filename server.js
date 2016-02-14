"use strict";

var express = require('express'),
  exphbs = require('express-handlebars'),
  path = require('path'),
  bodyParser = require('body-parser'),
  app,
  appDir = 'app'

var {modules, apis, helpers} = require(`./${appDir}/config`)

function serve_path(app, relative_path) {
  var dir = path.join(__dirname, relative_path)
  app.use(express.static(dir))
}

function setup_views(app, extension) {
  var config, cwd, fn, helper, helper_config, i, len

  helper_config = {}

  for (let helper of helpers) {
    helper_config[helper] = require(`./${appDir}/helpers/${helper}`)
  }

  cwd = process.cwd()

  config = exphbs({
    defaultLayout: 'main',
    layoutsDir: `${cwd}/${appDir}/layouts`,
    partialsDir: `${cwd}/${appDir}/partials`,
    helpers: helper_config,
    extname: extension
  })

  app.engine(extension, config)
  app.set('view engine', extension)
  app.set('views', `${cwd}/${appDir}/modules`)
}

function bind_routes(app) {
  // generate from config
  for (let module of modules) {
    require(`./${appDir}/modules/${module}/server`)(app)
  }
  for (let api of apis) {
    require(`./${appDir}/api/${api}`)(app)
  }
}

function setup_body_parser(app) {
  app.use(bodyParser.urlencoded({
    extended: false
  }))
}

function listen(app, port) {
  app.listen(port ? port : 8000);
}

app = express()
serve_path(app, './public')
setup_views(app, '.hbs')
setup_body_parser(app)
bind_routes(app)
listen(app, process.env.PORT)
