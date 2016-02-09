var ReactDOM = require('react-dom'),
  React = require('react'),
  $ = require('jquery'),
  Square = require('../../components/square')

var square = React.createFactory(Square)
var outlet = document.getElementById('outlet')

function handleClick(evt, count) {
  $.post('/api/square', {})
    .then((res) => render({count: res.count}))
}

function render(props) {
  props.onClick = handleClick
  ReactDOM.render(square(props), outlet)
}

render($(outlet).data('outlet'))
