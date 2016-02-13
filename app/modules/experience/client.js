var ReactDOM = require('react-dom'),
  React = require('react'),
  $ = require('jquery')

var View = require('./View'),
  ExperienceStore = require('./ExperienceStore'),
  dispatcher = require('./dispatcher'),
  actionTypes = require('./actionTypes')

var $outlet = $('#outlet')
var model = $outlet.data('model')

var view = React.createFactory(View)

// Notify store to receive raw model data
dispatcher.dispatch({
  actionType: actionTypes.RECEIVE_RAW_MODEL,
  rawModel: model
})

// Render
ReactDOM.render(view(), $outlet[0])
