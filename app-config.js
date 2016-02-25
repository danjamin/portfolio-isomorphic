"use strict"

module.exports = {
  appDir: 'app',
  port: process.env.PORT,
  modules: ['index', 'experience', 'rentals'],
  resources: [],
  helpers:['cdn', 'json', 'version']
}
