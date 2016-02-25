"use strict"

const ReactDOMServer = require('react-dom/server')
const React = require('react')

const View = require('./View')
const dispatcher = require('./dispatcher')
const actionTypes = require('./actionTypes')
const rentalData = require('./rentalData')

const view = React.createFactory(View)

module.exports = function (app) {
  app.get('/rentals', function (req, res) {
    let html

    // Notify store to receive raw model data
    dispatcher.dispatch({
      actionType: actionTypes.RECEIVE_RAW_MODEL,
      rawModel: rentalData
    })

    // Render top level component
    html = ReactDOMServer.renderToString(view())

    // Need to make sure we clear out the store .. just in case
    dispatcher.dispatch({ actionType: actionTypes.RESET })

    res.render('rentals/index', {
      outlet: {
        html: html,
        model: rentalData
      },
      title: 'Rentals',
      scripts: ['/modules/rentals.js']
    })
  })
}
