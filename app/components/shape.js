"use strict"

var React = require('react')

var {div} = React.DOM

class Shape extends React.Component {
  constructor(props) {
    super(props)
    this.className = 'shape'
  }

  render() {
    return div({ className: this.className, onClick: this.handleClick.bind(this) },
      this.props.count)
  }

  handleClick(evt) {
    this.props.onClick(evt, this.props.count + 1)
  }
}

Shape.propTypes = {
  onClick: React.PropTypes.func,
  count: React.PropTypes.number.isRequired
}

module.exports = Shape
