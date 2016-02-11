"use strict"

var config = require('./app/config')

module.exports = function (grunt) {
  // setup "external" deps
  var external = ['react', 'react-dom', 'jquery']

  // setup css
  var css_output = 'public/app.css'

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
    },
    sass: {
      dev: {
        files: {
          [css_output]: 'style/app.scss'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      dev: {
        src: css_output
      }
    },
    watch: {
      scripts: {
        files: 'style/**/*.scss',
        tasks: ['sass:dev', 'postcss:dev']
      }
    }
  })

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default is run and watch everything BUT browserify
  grunt.registerTask('default', ['sass:dev', 'postcss:dev', 'watch'])
}
