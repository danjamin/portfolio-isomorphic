"use strict"

var config = require('./app/config')
var _ = require('underscore')
var fs = require('fs')

module.exports = function (grunt) {
  // Config
  var external = ['react', 'react-dom', 'jquery', 'underscore'],
    scss_src = 'style/main.scss',
    static_src = 'static',
    module_src = 'app/modules',
    module_dest = 'modules',
    prod_dest = 'dist',
    dev_dest = 'public',
    css_dest = 'main.css',
    vendor_dest = 'vendor.js',
    asset_map_dest = 'assetMap.json',
    browserify_options_dev,
    browserify_options_prod,
    browserify_options_vendor_dev,
    browserify_options_vendor_prod,
    browserify_files_dev,
    browserify_files_prod,
    browserify_vendor_files_dev =  { [`${dev_dest}/${vendor_dest}`]: external },
    browserify_vendor_files_prod = { [`${prod_dest}/${vendor_dest}`]: external }

  browserify_options_dev =  {
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
  browserify_options_prod = {}
  _.extend(browserify_options_prod, browserify_options_dev, {
    watch: false,
    keepAlive: false,
    browserifyOptions: {
      debug: false
    },
    watchifyOptions: {}
  })
  // uglify prod build
  browserify_options_prod.transform.push(['uglifyify', {global: true}])

  // vendor browserify options
  browserify_options_vendor_dev = {
    require: external
  }
  browserify_options_vendor_prod = {}
  _.extend(browserify_options_vendor_prod, browserify_options_vendor_dev, {
    transform: [['uglifyify', {global: true}]]
  })

  // generate files from modules array
  browserify_files_dev = {}
  browserify_files_prod = {}

  for (let module of config.modules) {
    browserify_files_dev[`${dev_dest}/${module_dest}/${module}.js`] =
      browserify_files_prod[`${prod_dest}/${module_dest}/${module}.js`] =
      [`${module_src}/${module}/client.js`]
  }

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      vendor_dev: {
        files: browserify_vendor_files_dev,
        options: browserify_options_vendor_dev
      },
      vendor_prod: {
        files: browserify_vendor_files_prod,
        options: browserify_options_vendor_prod
      },
      dev: {
        files: browserify_files_dev,
        options: browserify_options_dev
      },
      prod: {
        files: browserify_files_prod,
        options: browserify_options_prod
      }
    },
    sass: {
      dev: {
        files: {
          [`${dev_dest}/${css_dest}`]: scss_src
        }
      },
      prod: {
        files: {
          [`${prod_dest}/${css_dest}`]: scss_src
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
        src: `${dev_dest}/${css_dest}`,
        options: {
          map: true
        }
      },
      prod: {
        src: `${prod_dest}/${css_dest}`,
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
          src: static_src,
          dest: dev_dest
        }
      },
      prod: {
        options: {
          src: static_src,
          dest: prod_dest
        }
      },
    },
    filerev: {
      options: {},
      prod: {
        src: `${prod_dest}/**/*.{css,js,pdf,png,ico}`,
      },
    },
    watch: {
      style: {
        files: 'style/**/*.scss',
        tasks: ['sass:dev', 'postcss:dev']
      },
      rsync: {
        files: `${static_src}/**/*`,
        tasks: ['rsync:dev']
      },
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
        cwd: prod_dest,
        src: '**'
      },
    },
    clean: {
      dev: [`${dev_dest}/**/*`],
      prod: [`${prod_dest}/**/*`]
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

  // Default is run and watch everything BUT browserify
  grunt.registerTask('default', [
    'clean:dev', 'sass:dev', 'postcss:dev', 'rsync:dev', 'watch'
  ])

  // TODO: break this out better
  grunt.registerTask('write_filerev', () => {
    var finalPaths = {}
    var substrIndex = prod_dest.length
    for (var orig in grunt.filerev.summary) {
      finalPaths[orig.substring(substrIndex)] = grunt.filerev.summary[orig].substring(substrIndex)
    }
    fs.writeFileSync(`${prod_dest}/${asset_map_dest}`, JSON.stringify(finalPaths))
  })

  // TODO: break this better
  grunt.registerTask('filerev_apply', () => {
    var fs = require('fs'),
      substrIndex = prod_dest.length,
      cssFile = grunt.filerev.summary[`${prod_dest}/main.css`],
      content = fs.readFileSync(cssFile, "utf8"),
      prefix = process.env.CDN_HOST ? '//' + process.env.CDN_HOST : ''

    content = content.replace(/url\(["']?([\w\@\.\-\/]+)["']?\)/gi, (match, p1) => {
      var rev_file = prefix + grunt.filerev.summary[`${prod_dest}${p1}`].substring(substrIndex)
      console.log(`Replaced ${p1} with ${rev_file}`)
      return `url(${rev_file})`
    })

    fs.writeFileSync(cssFile, content)
  })

  // Build for production
  grunt.registerTask('production', [
    'clean:prod', 'sass:prod', 'postcss:prod', 'rsync:prod',
    'browserify:vendor_prod', 'browserify:prod', 'filerev:prod', 'filerev_apply',
    'write_filerev'
  ])
}
