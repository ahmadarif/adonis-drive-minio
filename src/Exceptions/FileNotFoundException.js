'use strict'

const NE = require('node-exceptions')

class FileNotFoundException extends NE.RuntimeException {
  static file (path) {
    const exception = new this(`The file ${path} doesn't exist`, 404)
    exception.file = path
    return exception
  }
}

module.exports = FileNotFoundException
