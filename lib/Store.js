"use strict"

var EventEmitter = require('events'),
  isServer = require('./isServer')

var emitter = new EventEmitter(),
  CHANGE_EVENT = 'CHANGE'

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
