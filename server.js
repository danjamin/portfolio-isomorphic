"use strict";

const Environment = require('./lib/Environment')
const Server = require('./lib/Server')
const config = require('./app-config')

new Server(__dirname, {
    appDir: config.appDir,
    port: config.port
  })
  .servePath('./public', Environment.STAGING)
  .servePath('./robots', Environment.STAGING | Environment.PRODUCTION)
  .setupViews('.hbs', config.helpers)
  .setupBodyParser()
  .registerModules(config.modules)
  .registerResources(config.resources)
  .listen()
