"use strict"

class Environment {
  hasEnvironment(environments) {
    const isProd = process.env.NODE_ENV === 'production'
    const current = isProd ? Environment.PRODUCTION : Environment.STAGING
    return current & environments
  }
}
Environment.STAGING = 1
Environment.PRODUCTION = 2

module.exports = Environment
