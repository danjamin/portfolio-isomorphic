"use strict"

const http = require('http')
const zlib = require('zlib')
const pjson = require('../../package.json')

const version = pjson.version
const host = process.env.CDN_HOST ? process.env.CDN_HOST : ''

let assetMap = {}
let data

if (host) {
  http.get({
    host: host,
    path: `/assetMap-${version}.json`,
    headers: { 'accept-encoding': 'gzip' }
  }).on('response', response => {
    data = ''

    switch (response.headers['content-encoding']) {
      case 'gzip':
        response = response.pipe(zlib.createGunzip())
        break
    }

    response
      .on('data', chunk => data += chunk)
      .on('end', () => assetMap = JSON.parse(data))
  })
}


module.exports = function (path) {
  return `${host ? `//${host}` : ''}${assetMap && assetMap.hasOwnProperty(path) ? assetMap[path] : path}`
}
