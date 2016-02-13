"use strict"

var _ = require('underscore')

var actionTypes = require('./actionTypes'),
  dispatcher = require('./dispatcher'),
  Store = require('../../../lib/Store')

var model = []
var path = []

function reset() {
  model = []
  path = []
}

function pathExists(entry) {
  var dataSet

  pushPath(entry)
  dataSet = ExperienceStore.getFiltered()
  popPath(entry)

  return !!dataSet
}

function pushPath(entry) {
  path.push(entry)
}

function popPath() {
  if (path.length) {
    path.splice(path.length - 1, 1)
    return true
  }
  return false
}

class ExperienceStore extends Store {
  static getFiltered() {
    var dataSet = model

    _.every(path, (entry) => {
      dataSet = _.findWhere(dataSet, {label: entry.label})
      if (dataSet.hasOwnProperty('children') && dataSet.children.length) {
        dataSet = dataSet.children
        return true
      } else {
        dataSet = null
        return false
      }
    })

    return dataSet
  }

  static getPath() {
    return path
  }
}

ExperienceStore.dispatchToken = dispatcher.register(payload => {
  switch (payload.actionType) {
    case actionTypes.RESET:
      reset()
      break
    case actionTypes.RECEIVE_RAW_MODEL:
      model = payload.rawModel
      ExperienceStore.emitChange()
      break
    case actionTypes.NEXT:
      if (pathExists(payload.entry)) {
        pushPath(payload.entry)
        ExperienceStore.emitChange()
      }
      break
    case actionTypes.PREVIOUS:
      if (popPath()) {
        ExperienceStore.emitChange()
      }
      break
  }
})

module.exports = ExperienceStore
