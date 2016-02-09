var {client} = require('../services/redis')

module.exports = function (app) {
  app.post('/api/square', function (req, res) {
    client.incr('square:click_count', function (err, reply) {
      reply = reply ? parseInt(reply, 10) : 0
      res.send({count: reply})
    })
  })
}
