"use strict"

const ReactDOM = require('react-dom')
const React = require('react')
const $ = require('jquery')

const View = require('./View')
const dispatcher = require('./dispatcher')
const actionTypes = require('./actionTypes')

const $outlet = $('#outlet')
const model = $outlet.data('model')

const view = React.createFactory(View)

// Notify store to receive raw model data
dispatcher.dispatch({
  actionType: actionTypes.RECEIVE_RAW_MODEL,
  rawModel: model
})

// Render
ReactDOM.render(view(), $outlet[0])
