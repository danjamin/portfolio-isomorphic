"use strict"

const React = require('react')
const _ = require('underscore')

const {h2} = React.DOM

class BreadCrumbs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let labels = this.props.path.map(item => item.label)
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
