"use strict"

var EventEmitter = require('events')

var emitter = new EventEmitter(),
  CHANGE_EVENT = 'CHANGE'

function isServer() {
  return typeof window === 'undefined'
}

class Store {
  static addChangeListener(callback) {
    if (isServer()) {
      return
    }

    emitter.on(CHANGE_EVENT, callback)
  }
  static removeChangeListener(callback) {
    if (isServer()) {
      return
    }
    emitter.removeListener(CHANGE_EVENT, callback)
  }
  static emitChange() {
    emitter.emit(CHANGE_EVENT)
  }
}

module.exports = Store
