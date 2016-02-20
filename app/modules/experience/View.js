"use strict"

const React = require('react')

const ExperiencePieChart = require('../../components/ExperiencePieChart')
const BreadCrumbs = require('../../components/BreadCrumbs')
const ExperienceStore = require('./ExperienceStore')
const dispatcher = require('./dispatcher')
const actionTypes = require('./actionTypes')

const {div} = React.DOM
const experiencePieChart = React.createFactory(ExperiencePieChart)
const breadCrumbs = React.createFactory(BreadCrumbs)

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
