var http = require('http')

var assetMap = {}
var host = process.env.CDN_HOST ? process.env.CDN_HOST : ''

!function init() {
  if (host) {
    http.request({host: host, path: '/assetMap.json'}, res => {
      var str = ''
      res.on('data', function (chunk) {
        str += chunk;
      })
      res.on('end', function () {
        assetMap = JSON.parse(str)
      })
    }).end()
  }
}()

module.exports = function (path) {
  return `${host ? `//${host}` : ''}${assetMap && assetMap.hasOwnProperty(path) ? assetMap[path] : path}`
}
