"use strict"

var React = require('react'),
  _ = require('underscore')

var {h2} = React.DOM

class BreadCrumbs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var labels = this.props.path.map(item => item.label)
    labels = _.union(['Languages'], labels)

    return h2(
      { style: { marginBottom: 15 } },
      labels.join(' / ')
    )
  }
}

BreadCrumbs.propTypes = {
  path: React.PropTypes.array.isRequired,
}

module.exports = BreadCrumbs
