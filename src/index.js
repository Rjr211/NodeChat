const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')


const  app = express()
const server = http.createServer(app)
//server supports websockets
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
     console.log('New incoming connection')

     //emits to specisifc connection
    socket.emit('message', 'Welcome!')

    //emits to everybody but new connection
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if( filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)

        //event acknowledgement
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

//start http server
server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

