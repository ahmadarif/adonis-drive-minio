# adonis-drive-minio 💾 
[![npm version](https://badge.fury.io/js/adonis-drive-minio.svg)](https://badge.fury.io/js/adonis-drive-minio)
[![npm](https://img.shields.io/npm/dt/adonis-drive-minio.svg)](https://www.npmjs.com/package/adonis-drive-minio)
[![npm](https://img.shields.io/npm/l/adonis-drive-minio.svg)](https://www.npmjs.com/package/adonis-drive-minio)

Minio driver for AdonisJS Drive

# Requirements
- [Minio](https://www.minio.io/)
- [AdonisJS Drive](https://github.com/adonisjs/adonis-drive) (`adonis install @adonisjs/drive`)

# Installation
```
adonis install adonis-drive-minio
```

# Instructions
Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  ...
  'adonis-drive-minio/providers/DriveProvider'
]
```

Add new configuration inside `disks` module in `config/drive.js`:

```js
minio: {
  driver: 'minio',
  host: Env.get('MINIO_HOST'),
  port: Env.get('MINIO_PORT'),
  secure: Env.get('MINIO_SECURE'),
  accessKey: Env.get('MINIO_ACCESS'),
  secretKey: Env.get('MINIO_SECRET'),
  bucket: Env.get('MINIO_BUCKET'),
  region: Env.get('MINIO_REGION')
}
```

Add minio variables in `.env` file:
```
MINIO_HOST=
MINIO_PORT=
MINIO_SECURE=
MINIO_ACCESS=
MINIO_SECRET=
MINIO_BUCKET=
MINIO_REGION=
```

# Examples
## exists(relativePath) -> Boolean
Find if a file exists or not.

```js
const isExists = await Drive.disk('minio').exists('adonis.jpeg')
```

## get(relativePath, outputPath) -> String
Downloads and saves the object as a file in the local filesystem.

```js
const path = await Drive.disk('minio').get('adonis.jpeg', Helpers.tmpPath('adonis.jpeg'))
```

## getUrl(relativePath, bucket?) -> String
Returns url for a given key. Note this method doesn't validates the existence of file or it's visibility status.

```js
const url = await Drive.disk('minio').getUrl('adonis.jpeg')
```

## getSignedUrl(relativePath, expiry?) -> String
Presigned URLs are generated for temporary download/upload access to private objects.

```js
// url is valid for 10 minutes
const url = await Drive.disk('minio').getSignedUrl
('adonis.jpeg')

// url is valid for one hour
const url = await Drive.disk('minio', 3600).getSignedUrl
('adonis.jpeg')

```

## put(filePath, relativePath?) -> String
Create a new file.

```js
// url = bucketname/adonis.jpeg
const url = await Drive.disk('minio').put('/home/pictures/adonis.jpeg')

// url = bucketname/uploaded.jpeg
const url = await Drive.disk('minio').put('/home/pictures/adonis.jpeg', 'uploaded.jpeg')
```

## delete(relativePath) -> Boolean
Remove a file.

```js
const isDeleted = await Drive.disk('minio').delete('adonis.jpeg')
```

## copy(src, dest, destBucket?) -> String
Copy file from one location to another within.

```js
// copied in the same bucket
const url = await Drive.disk('minio').copy('adonis.jpeg', 'adonis-2.jpeg')

// copied to "other-bucket" bucket
const url = await Drive.disk('minio').copy('adonis.jpeg', 'adonis-2.jpeg', 'other-bucket')
```

## move(src, dest, destBucket?) -> String
Move file from one location to another within.

```js
// moved in the same bucket
const url = await Drive.disk('minio').move('adonis.jpeg', 'new-adonis.jpeg')

// moved to "other-bucket" bucket
const url = await Drive.disk('minio').move('adonis.jpeg', 'adonis-2.jpeg', 'other-bucket')
```

## Change bucket
You can change bucket at runtime, just passing the bucket name before action.

```js
const isExists = await Drive.disk('minio').bucket('new-bucket').exists('adonis.jpeg')
```

# Thanks
Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.