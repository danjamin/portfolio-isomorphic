"use strict"

const React = require('react')

const ENTER_KEY = 13

const {div, input, ul, li, button} = React.DOM

class FilterListing extends React.Component {
  constructor(props) {
    super(props)
    this._input = null
    this._button = null
  }

  render() {
    let list = this.props.filteredList.map(item => li({
      key: item.id,
      onClick: this.actionChoose.bind(this, item.city)
    }, item.city))

    return div({},
      'City: ',
      input({
        ref: (c) => this._input = c,
        onKeyUp: this.actionAutoComplete.bind(this)
      }),
      button({
        ref: (c) => this._button = c,
        onClick: this.actionSearch.bind(this)
      }, 'Search'),
      ul({}, list)
    )
  }

  actionAutoComplete(e) {
    if (e.keyCode === ENTER_KEY) {
      this._button.click()
    } else {
      this.props.onAutoComplete(this._input.value)
    }
  }

  actionSearch(e) {
    this.props.onSearch(this._input.value)
    this.props.onClearAutoComplete()
  }

  actionChoose(city, e) {
    this._input.value = city
    this.props.onClearAutoComplete()
  }
}

FilterListing.propTypes = {
  onClearAutoComplete: React.PropTypes.func.isRequired,
  onAutoComplete: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  filteredList: React.PropTypes.array.isRequired
}

module.exports = FilterListing
