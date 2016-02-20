"use strict"

const Environment = require('../../lib/Environment')

const env = new Environment()

let pjson
let version

module.exports = function () {
  if (env.hasEnvironment(Environment.STAGING)) {
    // only require pjson in staging
    if (!pjson && !version) {
      pjson = require('../../package.json')
      version = pjson.version
    }
    return `v${version}`
  }

  return ''
}
