# Instructions
Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  ...
  'adonis-drive-minio/providers/DriveMinioProvider'
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

Add minio variables in `.env`:
```
MINIO_HOST=
MINIO_PORT=
MINIO_SECURE=
MINIO_ACCESS=
MINIO_SECRET=
MINIO_BUCKET=
MINIO_REGION=
```