"use strict"

var config = require('./app/config')
var _ = require('underscore')

module.exports = function (grunt) {
  // setup "external" deps
  var external = ['react', 'react-dom', 'jquery', 'underscore']

  // setup css
  var css_output = 'public/main.css'

  var browserify_options_dev =  {
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

  // extend dev options
  var browserify_options_prod = {}
  _.extend(browserify_options_prod, browserify_options_dev, {
    watch: false,
    keepAlive: false,
    browserifyOptions: {
      debug: false
    },
    watchifyOptions: {}
  })
  // uglify prod build
  browserify_options_prod.transform.push('uglifyify')

  // vendor browserify options
  var browserify_options_vendor_dev = {
    require: external
  }
  var browserify_options_vendor_prod = {}
  _.extend(browserify_options_vendor_prod, browserify_options_vendor_dev, {
    transform: ['uglifyify']
  })

  // generate files from modules array
  var browserify_files = {}

  for (let module of config.modules) {
    browserify_files[`public/modules/${module}.js`] =
      [`app/modules/${module}/client.js`]
  }

  var browserify_vendor_files = { 'public/vendor.js': external }

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      vendor_dev: {
        files: browserify_vendor_files,
        options: browserify_options_vendor_dev
      },
      vendor_prod: {
        files: browserify_vendor_files,
        options: browserify_options_vendor_prod
      },
      dev: {
        files: browserify_files,
        options: browserify_options_dev
      },
      prod: {
        files: browserify_files,
        options: browserify_options_prod
      }
    },
    sass: {
      dist: {
        files: {
          [css_output]: 'style/main.scss'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')(),
        ]
      },
      dev: {
        src: css_output,
      },
      prod: {
        src: css_output,
        options: {
          map: false
        },
      },
    },
    rsync: {
      options: {
        args: ["--verbose"],
        exclude: [".git*"],
        recursive: true
      },
      static: {
        options: {
          src: './static',
          dest: './public'
        }
      },
      robots: {
        options: {
          src: 'robots.txt',
          dest: './public'
        }
      }
    },
    watch: {
      style: {
        files: 'style/**/*.scss',
        tasks: ['sass:dist', 'postcss:dev']
      },
      static: {
        files: 'static/**/*.*',
        tasks: ['rsync:static']
      },
      robots: {
        files: 'robots.txt',
        tasks: ['rsync:robots']
      }
    }
  })

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-rsync')

  // Default is run and watch everything BUT browserify
  grunt.registerTask('default', [
    'sass:dist', 'postcss:dev', 'rsync:static', 'rsync:robots', 'watch'
  ])

  // Build for production
  grunt.registerTask('production', [
    'sass:dist', 'postcss:prod', 'rsync:static', 'rsync:robots',
    'browserify:vendor_prod', 'browserify:prod'
  ])
}
