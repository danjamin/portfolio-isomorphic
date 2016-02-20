"use strict"

const EventEmitter = require('events')
const isServer = require('./isServer')

const emitter = new EventEmitter()
const CHANGE_EVENT = 'CHANGE'

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
