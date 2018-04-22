'use strict'

const Route = use('Route')
const Drive = use('Drive')
const Helpers = use('Helpers')

Route.post('minio', async ({ request, response }) => {
  const file = request.file('image')
  const type = `${file.type}/${file.subtype}`
  const url = await Drive.disk('minio').put(file.tmpPath, file.clientName, type)
  response.send({ data: { url: url } })
})

Route.get('minio/:filename/exists', async ({ params, response }) => {
  const filename = params.filename
  const exists = await Drive.disk('minio').exists(filename)
  response.send({ data: { exists: exists } })
})

Route.get('minio/:filename/url', async ({ params, response }) => {
  const filename = params.filename
  const url = await Drive.disk('minio').getUrl(filename)
  response.send({ data: { url: url } })
})

Route.get('minio/:filename/signUrl', async ({ params, response }) => {
  const filename = params.filename
  const url = await Drive.disk('minio').getSignedUrl(filename)
  response.send({ data: { url: url } })
})

Route.delete('minio/:filename', async ({ params, response }) => {
  const filename = params.filename
  const isDeleted = await Drive.disk('minio').delete(filename)
  response.send({ data: { isDeleted: isDeleted } })
})

Route.get('minio/:filename', async ({ params, response }) => {
  const filename = params.filename
  const path = await Drive.disk('minio').get(filename, Helpers.tmpPath('result.jpeg'))
  return response.download(path)
})

Route.put('minio/:filename/copy', async ({ params, request, response }) => {
  const filename = params.filename
  const destname = request.input('destname')
  const isCopied = await Drive.disk('minio').copy(filename, destname)
  response.send({ data: { isCopied: isCopied } })
})

Route.put('minio/:filename/move', async ({ params, request, response }) => {
  const filename = params.filename
  const destname = request.input('destname')
  const destbucket = request.input('destbucket')
  const isMoved = await Drive.disk('minio').move(filename, destname, destbucket)
  response.send({ data: { isMoved: isMoved } })
})
