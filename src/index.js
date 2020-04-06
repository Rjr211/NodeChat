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


// let count = 0;

// server (emit) => client (recieve) - countUpdated
//client (emit) => server (recieve) - increment


io.on('connection', (socket) => {
     console.log('New incoming connection')

     //emits to specisifc connection
    socket.emit('message', 'Welcome!')

    //emits to everybody but new connection
    socket.broadcast.emit('message', 'A new user has joined!')
    // //send an event on server
    //  socket.emit('countUpdated', count)

    // //listening for event on client
    //  socket.on('increment', () => {
    //      count++
    //      //listens for single event
    //      //socket.emit('countUpdated', count)

    //     //listens for all event
    //      io.emit('countUpdated', count)
    //  })

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

//start http server
server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

