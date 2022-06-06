const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
}) //in case server and client run on different urls
let userConnections = []
io.on('connection', (socket) => {
  console.log('client connected: ', socket.id)
  socket.on('userconnect', (payload) => {
    socket.emit('updateData', {userConnections})
    userConnections.push(
      {
        connectionId: socket.id,
        ...payload
      }
    )
      io.emit('newUser', {
        connectionId: socket.id,
        ...payload
      });
  })

  socket.on('disconnect', (reason) => {
    console.log("REASON: ", reason)
    userConnections = userConnections.filter(x => x.connectionId !== socket.id)
      io.emit('userLeft', socket.id);
  })
})
server.listen(PORT, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', PORT)
})