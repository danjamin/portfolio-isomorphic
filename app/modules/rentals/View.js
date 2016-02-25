"use strict"

const React = require('react')

const RentalStore = require('./RentalStore')
const dispatcher = require('./dispatcher')
const actionTypes = require('./actionTypes')
const RentalListing = require('../../components/RentalListing')
const FilterListing = require('../../components/FilterListing')

const {div} = React.DOM
const rentalListing = React.createFactory(RentalListing)
const filterListing = React.createFactory(FilterListing)

function getStateFromStores() {
  return {
    rentals: RentalStore.getFiltered(),
    autoCompleteSet: RentalStore.getAutoCompleteSet()
  }
}

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()
  }

  componentWillMount() {
    RentalStore.addChangeListener(this.onChange.bind(this))
  }

  componentWillUnmount() {
    RentalStore.removeChangeListener(this.onChange.bind(this))
  }

  render() {
    let rentals = this.state.rentals.map(rental => rentalListing({
      key: rental.id,
      rental: rental
    }))

    return div(
      {},
      filterListing({
        filteredList: this.state.autoCompleteSet,
        onClearAutoComplete: this.handleClearAutoComplete.bind(this),
        onAutoComplete: this.handleAutoComplete.bind(this),
        onSearch: this.handleSearch.bind(this)
      }),
      rentals
    )
  }

  handleClearAutoComplete() {
    dispatcher.dispatch({
      actionType: actionTypes.CLEAR_RENTAL_AUTOCOMPLETE_CITY
    })
  }

  handleAutoComplete(param) {
    if (param) {
      dispatcher.dispatch({
        actionType: actionTypes.RENTAL_AUTOCOMPLETE_CITY,
        city: param
      })
    } else {
      dispatcher.dispatch({
        actionType: actionTypes.CLEAR_RENTAL_AUTOCOMPLETE_CITY
      })
    }
  }

  handleSearch(param) {
    if (param) {
      dispatcher.dispatch({
        actionType: actionTypes.RENTAL_SEARCH_CITY,
        city: param
      })
    } else {
      dispatcher.dispatch({
        actionType: actionTypes.CLEAR_RENTAL_SEARCH_CITY
      })
    }
  }

  onChange() {
    this.setState(getStateFromStores())
  }
}

module.exports = View
