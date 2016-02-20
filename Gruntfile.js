"use strict"

const config = require('./app-config')
const _ = require('underscore')
const fs = require('fs')
const pjson = require('./package.json')
const version = pjson.version

module.exports = function (grunt) {
  // Config
  const external = ['react', 'react-dom', 'jquery', 'underscore']
  const scssSrc = 'style/main.scss'
  const staticSrc = 'static'
  const moduleSrc = 'app/modules'
  const jsHintSrc = ['*.js', 'app/**/*.js', 'lib/**/*.js']
  const moduleDest = 'modules'
  const prodDest = 'dist'
  const devDest = 'public'
  const cssDest = 'main.css'
  const vendorDest = 'vendor.js'
  const assetMapDest = `assetMap-${version}.json`
  const browserifyVendorFilesDev = { [`${devDest}/${vendorDest}`]: external }
  const browserifyVendorFilesProd = { [`${prodDest}/${vendorDest}`]: external }

  const browserifyOptionsDev = {
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
  const browserifyOptionsProd = {}
  _.extend(browserifyOptionsProd, browserifyOptionsDev, {
    watch: false,
    keepAlive: false,
    browserifyOptions: {
      debug: false
    },
    watchifyOptions: {}
  })
  // uglify prod build
  browserifyOptionsProd.transform.push(['uglifyify', {global: true}])

  // vendor browserify options
  const browserifyOptionsVendorDev = {
    require: external
  }
  const browserifyOptionsVendorProd = {}
  _.extend(browserifyOptionsVendorProd, browserifyOptionsVendorDev, {
    transform: [['uglifyify', {global: true}]]
  })

  // generate files from modules array
  const browserifyFilesDev = {}
  const browserifyFilesProd = {}

  for (let module of config.modules) {
    browserifyFilesDev[`${devDest}/${moduleDest}/${module}.js`] =
      browserifyFilesProd[`${prodDest}/${moduleDest}/${module}.js`] =
      [`${moduleSrc}/${module}/client.js`]
  }

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'vendor-dev': {
        files: browserifyVendorFilesDev,
        options: browserifyOptionsVendorDev
      },
      'vendor-prod': {
        files: browserifyVendorFilesProd,
        options: browserifyOptionsVendorProd
      },
      dev: {
        files: browserifyFilesDev,
        options: browserifyOptionsDev
      },
      prod: {
        files: browserifyFilesProd,
        options: browserifyOptionsProd
      }
    },
    sass: {
      dev: {
        files: {
          [`${devDest}/${cssDest}`]: scssSrc
        }
      },
      prod: {
        files: {
          [`${prodDest}/${cssDest}`]: scssSrc
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')(),
        ]
      },
      dev: {
        src: `${devDest}/${cssDest}`,
        options: {
          map: true
        }
      },
      prod: {
        src: `${prodDest}/${cssDest}`,
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
      dev: {
        options: {
          src: staticSrc,
          dest: devDest
        }
      },
      prod: {
        options: {
          src: staticSrc,
          dest: prodDest
        }
      },
    },
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 3, // 3 = default
        },
        files: [{
          expand: true,
          cwd: prodDest,
          src: ['**/*.{png,jpg,gif}'],
          dest: prodDest
        }]
      }
    },
    filerev: {
      options: {},
      prod: {
        src: `${prodDest}/**/*.{css,js,pdf,png,ico}`,
      },
    },
    watch: {
      style: {
        files: 'style/**/*.scss',
        tasks: ['sass:dev', 'postcss:dev']
      },
      rsync: {
        files: `${staticSrc}/**/*`,
        tasks: ['rsync:dev']
      },
      jshint: {
        files: jsHintSrc,
        tasks: ['jshint:dev']
      }
    },
    s3: {
      options: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        headers: {
          CacheControl: 31536000 /* 1yr */
        }
      },
      prod: {
        cwd: prodDest,
        src: '**'
      },
    },
    jshint: {
      options: {
        jshintrc: true
      },
      dev: jsHintSrc
    },
    clean: {
      dev: [`${devDest}/**/*`],
      prod: [`${prodDest}/**/*`]
    }
  })

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-rsync')
  grunt.loadNpmTasks('grunt-filerev')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-aws')
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-contrib-jshint')

  // Default is run and watch everything BUT browserify
  grunt.registerTask('default', [
    'jshint:dev', 'sass:dev', 'postcss:dev', 'rsync:dev', 'watch'
  ])

  // TODO: break this out better
  grunt.registerTask('write-filerev', () => {
    const finalPaths = {}
    const substrIndex = prodDest.length
    for (let orig in grunt.filerev.summary) {
      if (grunt.filerev.summary.hasOwnProperty(orig)) {
        finalPaths[orig.substring(substrIndex)] = grunt.filerev.summary[orig].substring(substrIndex)
      }
    }
    fs.writeFileSync(`${prodDest}/${assetMapDest}`, JSON.stringify(finalPaths))
  })

  // TODO: break this better
  grunt.registerTask('filerev-apply', () => {
    const fs = require('fs')
    const substrIndex = prodDest.length
    const cssFile = grunt.filerev.summary[`${prodDest}/main.css`]
    const prefix = process.env.CDN_HOST ? '//' + process.env.CDN_HOST : ''
    let content = fs.readFileSync(cssFile, "utf8")

    content = content.replace(/url\(["']?([\w\@\.\-\/]+)["']?\)/gi, (match, p1) => {
      const revFile = prefix + grunt.filerev.summary[`${prodDest}${p1}`].substring(substrIndex)
      console.log(`Replaced ${p1} with ${revFile}`)
      return `url(${revFile})`
    })

    fs.writeFileSync(cssFile, content)
  })

  // Build for production
  grunt.registerTask('production', [
    'clean:prod', 'sass:prod', 'postcss:prod', 'rsync:prod', 'imagemin:prod',
    'browserify:vendor-prod', 'browserify:prod', 'filerev:prod', 'filerev-apply',
    'write-filerev'
  ])
}
