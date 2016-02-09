var ReactDOMServer = require('react-dom/server'),
  React = require('react')

var Square = require('../../components/square')
var {client} = require('../../services/redis')

var square = React.createFactory(Square)

module.exports = function (app) {
  app.get('/square', (req, res) => {
    client.get("square:click_count", (err, reply) => {
      var data, html
      reply = reply ? parseInt(reply, 10) : 0
      data = {count: reply}
      html = ReactDOMServer.renderToString(square(data))
      res.render('square/index', {
        outlet: {
          html: html,
          data: data
        },
        title: 'Square',
        scripts: ['/modules/square.js']
      })
    })
  })
}
