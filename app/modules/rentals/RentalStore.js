"use strict"

const _ = require('underscore')

const actionTypes = require('./actionTypes')
const dispatcher = require('./dispatcher')
const Store = require('../../../lib/Store')

let model = []
let autoCompleteCity = null
let searchCity = null

class RentalStore extends Store {
  static getFiltered() {
    if (searchCity) {
      return _.where(model, {city: searchCity})
    } else {
      return []
    }
  }

  static getAutoCompleteSet() {
    if (autoCompleteCity) {
      return _.filter(model, item => {
        return item.city.match(new RegExp(`${autoCompleteCity}`, 'i'))
      })
    } else {
      return []
    }
  }
}

function reset() {
  model = []
  autoCompleteCity = null
}

RentalStore.dispatchToken = dispatcher.register(payload => {
  switch (payload.actionType) {
    case actionTypes.RESET:
      reset()
      break
    case actionTypes.RECEIVE_RAW_MODEL:
      model = payload.rawModel
      RentalStore.emitChange()
      break
    case actionTypes.RENTAL_AUTOCOMPLETE_CITY:
      autoCompleteCity = payload.city
      RentalStore.emitChange()
      break
    case actionTypes.CLEAR_RENTAL_AUTOCOMPLETE_CITY:
      autoCompleteCity = null
      RentalStore.emitChange()
      break
    case actionTypes.RENTAL_SEARCH_CITY:
      searchCity = payload.city
      RentalStore.emitChange()
      break
    case actionTypes.CLEAR_RENTAL_SEARCH_CITY:
      searchCity = null
      RentalStore.emitChange()
      break
  }
})

module.exports = RentalStore
