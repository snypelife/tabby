var express = require('express')
var server = express()

server
.use(express.static(__dirname + '/src'))
.get('/', function (req, res) {
  res.sendfile('index.html')
})
.listen(3000, function () {
  console.log('server started')
})
