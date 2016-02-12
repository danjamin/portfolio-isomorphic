var ReactDOMServer = require('react-dom/server'),
  React = require('react')

var View = require('./View'),
  actionTypes = require('./actionTypes'),
  chartData = require('./chartData')

var view = React.createFactory(View)

module.exports = function (app) {
  app.get('/experience', function (req, res) {
    var html

    // Render top level component
    html = ReactDOMServer.renderToString(view({ data: chartData }))

    res.render('experience/index', {
      outlet: {
        html: html,
        model: chartData
      },
      title: 'Experience',
      scripts: ['/modules/experience.js']
    })
  })
}
