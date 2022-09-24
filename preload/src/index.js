const fs = require('fs')
const path = require('path')
const express = require('express')
const template = require('art-template')
const multer = require('multer')

let fileDb = new Map()

let server

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      'D:\\code\\web\\workplace\\Practice-Project\\file-share\\file-share-holders'
    )
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: fileStorageEngine })

// 建立express实例和初始化路由
const initApp = () => {
  let app = express()
  // 文件下载页面
  app.get('/', function (req, res) {
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
  }),
    app.post('/addFile', upload.single('file'), (req, res, next) => {
      let file = req.file
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      fileDb.set(file.originalname, { name: file.originalname, path: file.path })
      console.log(fileDb.values())
      res.redirect('/')
    })
  return app
}

const startServer = (port = 5543) => {
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
