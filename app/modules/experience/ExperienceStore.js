"use strict"

const _ = require('underscore')

const actionTypes = require('./actionTypes')
const dispatcher = require('./dispatcher')
const Store = require('../../../lib/Store')

let model = []
let path = []

class ExperienceStore extends Store {
  static getFiltered() {
    let dataSet = model

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

function reset() {
  model = []
  path = []
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

function pathExists(entry) {
  let dataSet

  pushPath(entry)
  dataSet = ExperienceStore.getFiltered()
  popPath(entry)

  return !!dataSet
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
