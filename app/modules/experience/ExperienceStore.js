"use strict"

var _ = require('underscore')

var actionTypes = require('./actionTypes'),
  Store = require('../../../lib/Store')

var model = []
var path = []

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

  static notify(type, data) {
    switch (type) {
      case actionTypes.RECEIVE_RAW_MODEL:
        model = data.rawModel
        super.emitChange()
        break
      case actionTypes.NEXT:
        if (pathExists(data.entry)) {
          pushPath(data.entry)
          super.emitChange()
        }
        break
      case actionTypes.PREVIOUS:
        if (popPath()) {
          super.emitChange()
        }
        break;
    }
  }
}

module.exports = ExperienceStore
