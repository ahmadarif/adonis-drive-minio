'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const Minio = require('./src/Drivers')

class DriveMinioProvider extends ServiceProvider {
  register () {
    this.app.extend('Adonis/Addons/Drive', 'minio', () => {
      return Minio
    })
  }
}

module.exports = DriveMinioProvider
