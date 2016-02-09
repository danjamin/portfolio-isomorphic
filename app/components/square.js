"use strict"

var Shape = require('./shape')

class Square extends Shape {
  constructor(props) {
    super(props)
    this.className += " square"
  }
}

module.exports = Square
