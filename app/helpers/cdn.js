module.exports = function (path) {
  var root = process.env.CDN_ROOT
  root = root ? root : ""

  return `${root}${path}`
}
