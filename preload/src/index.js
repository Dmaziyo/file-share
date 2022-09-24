const fs = require('fs')
const path = require('path')
const express = require('express')
const template = require('art-template')

let fileDb = new Map()

let server

// 建立express实例和初始化路由
const initApp = () => {
  let app = express()
  // 文件下载页面
  app.get('/', function (req, res) {
    console.log('请求成功')
    let files = Array.from(fileDb.values())
    let html = template(__dirname + '/views/index.art.html', { files })
    res.send(html)
  })
  // 文件下载
  app.get('/download/:name', function (req, res) {
    let filename = req.params.name
    let filePath = fileDb.get(filename).path
    res.download(filePath, path.basename(filePath), () => {
      console.log('send file: ' + filePath)
    })
  })
  return app
}

const startServer = (port = 8080) => {
  const app = initApp()
  server = app.listen(port, () => {
    console.log(`start on :http://localhost:${port}`)
  })
  return { success: true, message: '启动成功' }
}

const stopServer = () => {
  server.close()
}

const addFile = file => {
  fileDb.set(file.name, file)
}

const removeFile = file => {
  fileDb.delete(file.name)
}

const listFiles = () => {
  return fileDb.values()
}

startServer()
// window.api = {
//   startServer,
//   stopServer,
//   listFiles,
//   setShareFilePath
// }
addFile({ name: '1.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\1.txt' })
addFile({ name: '2.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\2.txt' })
addFile({ name: '3.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\3.txt' })
addFile({ name: '4.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\4.txt' })
addFile({ name: '5.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\5.txt' })
console.log(listFiles())
removeFile({ name: '5.txt', path: 'C:\\Users\\24794\\Desktop\\共享文件夹\\5.txt' })
console.log(listFiles())
