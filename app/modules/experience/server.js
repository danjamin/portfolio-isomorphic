var ReactDOMServer = require('react-dom/server'),
  React = require('react')

var View = require('./View'),
  dispatcher = require('./dispatcher'),
  actionTypes = require('./actionTypes'),
  chartData = require('./chartData')

var view = React.createFactory(View)

module.exports = function (app) {
  app.get('/experience', function (req, res) {
    var html

    // Notify store to receive raw model data
    dispatcher.dispatch({
      actionType: actionTypes.RECEIVE_RAW_MODEL,
      rawModel: chartData
    })

    // Render top level component
    html = ReactDOMServer.renderToString(view())

    // Need to make sure we clear out the store .. just in case
    dispatcher.dispatch({ actionType: actionTypes.RESET })

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
