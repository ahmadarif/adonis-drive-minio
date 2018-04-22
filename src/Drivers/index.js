'use strict'

const minio = require('minio')
const Resetable = require('resetable')
const path = require('path')
const FileNotFoundException = require('../Exceptions/FileNotFoundException')

/**
 * Minio driver for flydrive
 *
 * @class Minio
 */
class Minio {
  constructor (config) {
    this.minioClient = new minio.Client({
      endPoint: config.host,
      port: parseInt(config.port),
      secure: config.secure === 'true',
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      region: config.region
    })

    this._bucket = new Resetable(config.bucket)
  }

  /**
   * Use a different bucket at runtime.
   *
   * @method bucket
   *
   * @param  {String} bucket
   *
   * @chainable
   */
  bucket (bucket) {
    this._bucket.set(bucket)
    return this
  }

  /**
   * Finds if a file exists or not.
   *
   * @method exists
   * @async
   *
   * @param  {String} location
   *
   * @return {Promise<Boolean>}
   */
  exists (location) {
    return new Promise((resolve, reject) => {
      this.minioClient.statObject(this._bucket.pull(), location, function (error, stat) {
        if (error) return resolve(false)
        return resolve(true)
      })
    })
  }

  /**
   * Create a new file.
   *
   * @method put
   * @async
   *
   * @param  {String} content
   * @param  {String} [location=content basename]
   * @param  {String} type
   *
   * @return {Promise<String>}
   */
  put (content, location, type = null) {
    const bucket = this._bucket.pull()
    const url = this.getUrl(location, bucket)
    location = location || path.basename(content)

    return new Promise((resolve, reject) => {
      if (type) {
        this.minioClient.fPutObject(bucket, location, content, type, function (err, etag) {
          if (err) return reject(err)
          return resolve(url)
        })
      } else {
        this.minioClient.fPutObject(bucket, location, content, function (err, etag) {
          if (err) return reject(err)
          return resolve(url)
        })
      }
    })
  }

  /**
   * Remove a file.
   *
   * @method delete
   * @async
   *
   * @param  {String} location
   *
   * @return {Promise<Boolean>}
   */
  delete (location) {
    return new Promise((resolve, reject) => {
      this.minioClient.removeObject(this._bucket.pull(), location, function (err) {
        if (err) return reject(err)
        return resolve(true)
      })
    })
  }

  /**
   * Downloads and saves the object as a file in the local filesystem.
   *
   * @method get
   * @async
   *
   * @param  {String}  location
   * @param  {String}  outputPath
   *
   * @return {Promise<String>}
   */
  get (location, outputPath) {
    return new Promise((resolve, reject) => {
      this.minioClient.fGetObject(this._bucket.pull(), location, outputPath, function (err) {
        if (err) return reject(err)
        return resolve(outputPath)
      })
    })
  }

  /**
   * Copy file from one location to another within
   * or accross minio buckets.
   *
   * @method copy
   *
   * @param  {String} src
   * @param  {String} dest
   * @param  {String} [destBucket = this._bucket]
   *
   * @return {Promise<String>}
   */
  copy (src, dest, destBucket) {
    const bucket = this._bucket.pull()
    const url = this.getUrl(dest, destBucket)
    destBucket = destBucket || bucket

    return new Promise((resolve, reject) => {
      this.minioClient.copyObject(destBucket, dest, `${bucket}/${src}`, function (err, data) {
        if (err) return reject(err)
        return resolve(url)
      })
    })
  }

  /**
   * Moves file from one location to another. This
   * method will call `copy` and `delete` under
   * the hood.
   *
   * @method move
   *
   * @param  {String} src
   * @param  {String} dest
   * @param  {String} [destBucket = this._bucket]
   *
   * @return {Promise<String>}
   */
  async move (src, dest, destBucket) {
    const srcbucket = this._bucket.get()
    const url = await this.copy(src, dest, destBucket)
    await this.bucket(srcbucket).delete(src)
    return url
  }

  /**
   * Returns url for a given key. Note this method doesn't
   * validates the existence of file or it's visibility
   * status.
   *
   * @method getUrl
   *
   * @param  {String} location
   * @param  {String} bucket
   *
   * @return {String}
   */
  getUrl (location, bucket) {
    bucket = bucket || this._bucket.pull()
    const protocol = this.minioClient.protocol
    const host = this.minioClient.host
    const port = this.minioClient.port

    if (port === 80) {
      return `${protocol}//${host}/${bucket}/${location}`
    } else {
      return `${protocol}//${host}:${port}/${bucket}/${location}`
    }
  }

  /**
   * Presigned URLs are generated for temporary download/upload access to private objects.
   *
   * @method getSignedUrl
   * @async
   *
   * @param  {String}     location
   * @param  {Number}     [expiry = 600] 10 minutes
   *
   * @return {Promise<String>}
   */
  getSignedUrl (location, expiry = 600) {
    return new Promise((resolve, reject) => {
      this.exists(location).then(exists => {
        if (!exists) return reject(FileNotFoundException.file(location))
        this.minioClient.presignedGetObject(this._bucket.pull(), location, expiry, function (err, presignedUrl) {
          if (err) return reject(err)
          return resolve(presignedUrl)
        })
      }).catch(err => reject(err))
    })
  }
}

module.exports = Minio
