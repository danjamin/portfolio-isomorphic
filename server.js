"use strict";

const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const appDir = 'app'

const app = express()
const {modules, apis, helpers} = require(`./${appDir}/config`)

function isStagingEnv() {
  return process.env.NODE_ENV !== 'production'
}

function servePath(app, relativePath) {
  const dir = path.join(__dirname, relativePath)
  app.use(express.static(dir))
}

function setupViews(app, extension) {
  const cwd = process.cwd()
  const helperConfig = {}

  for (let helper of helpers) {
    helperConfig[helper] = require(`./${appDir}/helpers/${helper}`)
  }

  const config = exphbs({
    defaultLayout: 'main',
    layoutsDir: `${cwd}/${appDir}/layouts`,
    partialsDir: `${cwd}/${appDir}/partials`,
    helpers: helperConfig,
    extname: extension
  })

  app.engine(extension, config)
  app.set('view engine', extension)
  app.set('views', `${cwd}/${appDir}/modules`)
}

function bindRoutes(app) {
  // generate from config
  for (let module of modules) {
    require(`./${appDir}/modules/${module}/server`)(app)
  }
  for (let api of apis) {
    require(`./${appDir}/api/${api}`)(app)
  }
}

function setupBodyParser(app) {
  app.use(bodyParser.urlencoded({
    extended: false
  }))
}

function listen(app, port) {
  app.listen(port ? port : 8000);
}

// serve robots in all environments
servePath(app, '/robots')

// in non-prod serve public
if (isStagingEnv()) {
  servePath(app, '/public')
}

setupViews(app, '.hbs')
setupBodyParser(app)
bindRoutes(app)
listen(app, process.env.PORT)
