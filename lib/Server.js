"use strict"

const _ = require('underscore')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const express = require('express')

const Environment = require('./Environment')

class Server extends Environment {
  constructor(dirname, config) {
    super()
    this.dirname = dirname
    this.config = _.extend({}, {
      appDir: 'app',
      port: 8000
    }, config)
    this.app = express()
  }

  servePath(relativePath, environments /* bitwise */) {
    let dir

    if (this.hasEnvironment(environments)) {
      dir = path.join(this.dirname, relativePath)
      this.app.use(express.static(dir))
    }

    return this
  }

  setupViews(extension, helpers /* [ name, ... ] */) {
    const helperConfig = {}

    for (let name of helpers) {
      helperConfig[name] = require(path.join(this.dirname, `./${this.config.appDir}/helpers/${name}`))
    }

    const config = exphbs({
      defaultLayout: 'main',
      layoutsDir: path.join(this.dirname, `./${this.config.appDir}/layouts`),
      partialsDir: path.join(this.dirname, `./${this.config.appDir}/partials`),
      helpers: helperConfig,
      extname: extension
    })

    this.app.engine(extension, config)
    this.app.set('view engine', extension)
    this.app.set('views', path.join(this.dirname, `./${this.config.appDir}/modules`))

    return this
  }

  setupBodyParser() {
    this.app.use(bodyParser.urlencoded({
      extended: false
    }))

    return this
  }

  registerModules(modules) {
    for (let name of modules) {
      require(path.join(this.dirname, `./${this.config.appDir}/modules/${name}/server`))(this.app)
    }

    return this
  }

  registerResources(resources) {
    for (let name of resources) {
      require(path.join(this.dirname, `./${this.config.appDir}/resources/${name}`))(this.app)
    }

    return this
  }

  listen() {
    this.app.listen(this.config.port)

    return this
  }
}

module.exports = Server
