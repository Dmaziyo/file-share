const fs = require('fs')
const path = require('path')
const express = require('express')

let shareFileRoot
let server

// 配置路由请求
const initFileShareRouter = (app, rootPath) => {
  app.get('/file/:name', function (req, res) {
    let fileName = req.params.name
    let absFilename = path.join(rootPath, fileName)
    res.download(absFilename, path.basename(absFilename), () => {
      console.log('send file: ' + absFilename)
    })
  })
}

// 建立express实例和初始化路由
const initApp = rootPath => {
  let app = express()
  initFileShareRouter(app, rootPath)
  return app
}

const startServer = (port = 8080) => {
  if (!shareFileRoot) {
    return { success: false, message: '没有设置共享文件' }
  }
  const app = initApp(shareFileRoot)
  server = app.listen(port, () => {
    console.log(`start on :http://127.0.0.1:${port}`)
  })
  return { success: true, message: '启动成功' }
}

const stopServer = () => {
  server.close()
}

// 读取文件目录并且打印
const listFiles = dir => {
  let absDir = shareFileRoot + dir
  let result = []
  let filenames = fs.readdirSync(absDir)
  for (let fileName of filenames) {
    let absolutePath = path.join(absDir, fileName)
    let data = fs.statSync(absolutePath)
    result.push({ filename: fileName, isFile: data.isFile() })
  }
  return result
}

const setShareFilePath = filePath => {
  shareFileRoot = filePath
}
setShareFilePath('C:\\Users\\24794\\Desktop\\共享文件')
let result = listFiles('')
console.log(result)

window.api = {
  startServer,
  stopServer,
  listFiles,
  setShareFilePath
}
