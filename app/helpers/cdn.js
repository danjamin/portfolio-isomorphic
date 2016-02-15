var http = require('http'),
  zlib = require('zlib')

var assetMap = {}
var host = process.env.CDN_HOST ? process.env.CDN_HOST : ''

!function init() {
  if (host) {
    http.get({
      host: host,
      path: '/assetMap.json',
      headers: { 'accept-encoding': 'gzip' }
    }).on('response', response => {
      var data = ''

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
}()

module.exports = function (path) {
  return `${host ? `//${host}` : ''}${assetMap && assetMap.hasOwnProperty(path) ? assetMap[path] : path}`
}
