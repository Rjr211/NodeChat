const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const  app = express()
const server = http.createServer(app)
//server supports websockets
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
     console.log('New incoming connection')
})

//start http server
server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

//refactored code to use socket.io, required socket.io module, loaded client side socket.io, tested server