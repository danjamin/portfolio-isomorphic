var ReactDOM = require('react-dom'),
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore')

var ExperiencePieChart = require('../../components/experience-pie-chart')

var experience_pie_chart = React.createFactory(ExperiencePieChart)
var $outlet = $('#outlet')
var model = $outlet.data('model')
var chartData = model.data
var path = []

function findDataSet(item) {
  var children = chartData

  if (item) {
    path.push(item)
  }

  _.each(path, (entry) => {
    children = _.findWhere(children, {label: entry.label}).children
  })

  if (item) {
    path.splice(path.length-1, 1)
  }

  if (children) {
    if (item) {
      path.push(item)
    }
    return children
  }
}

function handleBackClick(e) {
  var new_model = {}
  var data_set

  if (!path.length) {
    return
  }

  path.splice(path.length - 1, 1)
  data_set = findDataSet()
  _.extend(new_model, model, {data: data_set, onBackClick: path.length ? handleBackClick : null})
  render(new_model)
}

function render(props) {
  props.onClick = (item) => {
    var new_model = {}
    var children = findDataSet(item)

    if (children) {
      _.extend(new_model, model, {data: children, onBackClick: handleBackClick})
      render(new_model);
    }
  }
  ReactDOM.render(experience_pie_chart(props), $outlet[0])
}

render(model)
