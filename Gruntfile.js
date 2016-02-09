"use strict"

var config = require('./app/config')

module.exports = function (grunt) {
  // setup "external" deps
  var external = ['react', 'react-dom', 'jquery']

  // generate files from modules array
  var browserify_files = {}

  for (let module of config.modules) {
    browserify_files[`public/modules/${module}.js`] =
      [`app/modules/${module}/client.js`]
  }

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      vendor: {
        files: { 'public/vendor.js': external },
        options: { require: external }
      },
      dev: {
        files: browserify_files,
        options: {
          transform: [ ['babelify', {presets: ['es2015']}] ],
          watch: true,
          keepAlive: true,
          external: external,
          browserifyOptions: {
            debug: true,
            extensions: '.js'
          },
          watchifyOptions: {
            poll: 100,
            debug: true
          }
        }
      }
    }
  })

  // Load the plugin that provides the "browserify" task.
  grunt.loadNpmTasks('grunt-browserify')

  // Default task(s)
  grunt.registerTask('default', ['browserify:dev'])
}
