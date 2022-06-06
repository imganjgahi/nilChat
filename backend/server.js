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

  
  // socket.join("meeting")
  socket.on('userconnect', (payload) => {
    socket.join(payload.meetingId)
    userConnections.push(
      {
        connectionId: socket.id,
        ...payload
      }
    )
    console.log("userConnections: ", payload)
    userConnections.forEach(user => {
      io.to(user.connectionId).emit('userList', userConnections.filter(x => x.meetingId === user.meetingId));
    })
    // socket.to("meeting").emit('newUser', {displayName: payload.displayName})
  })

  socket.on('disconnect', (reason) => {
    console.log("REASON: ", reason)
    userConnections = userConnections.filter(x => x.connectionId !== socket.id)
    userConnections.forEach(user => {
      io.to(user.connectionId).emit('userList', userConnections.filter(x => x.meetingId === user.meetingId));
    })
  })
})
// setInterval(() => {
//   io.to('meeting').emit('time', new Date())
// }, 1000)
server.listen(PORT, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', PORT)
})