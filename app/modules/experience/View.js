"use strict"

var React = require('react')

var ExperiencePieChart = require('../../components/ExperiencePieChart'),
  BreadCrumbs = require('../../components/BreadCrumbs'),
  ExperienceStore = require('./ExperienceStore'),
  dispatcher = require('./dispatcher'),
  actionTypes = require('./actionTypes')

var {div} = React.DOM

var experiencePieChart = React.createFactory(ExperiencePieChart),
  breadCrumbs = React.createFactory(BreadCrumbs)

function getStateFromStores() {
  return {
    data: ExperienceStore.getFiltered(),
    path: ExperienceStore.getPath()
  }
}

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()
  }

  componentWillMount() {
    ExperienceStore.addChangeListener(this.onChange.bind(this))
  }

  componentWillUnmount() {
    ExperienceStore.removeChangeListener(this.onChange.bind(this))
  }

  render() {
    return div(
      {},
      breadCrumbs({path: this.state.path}),
      experiencePieChart(
        { data: this.state.data, onClick: this.handleClick.bind(this),
          onBackClick: this.state.path.length ? this.onBackClick.bind(this) : null }
      )
    )
  }

  handleClick(entry) {
    dispatcher.dispatch({
      actionType: actionTypes.NEXT,
      entry: entry
    })
  }

  onBackClick() {
    dispatcher.dispatch({ actionType: actionTypes.PREVIOUS })
  }

  onChange() {
    this.setState(getStateFromStores())
  }
}

View.defaultProps = {
  path: []
}

module.exports = View
