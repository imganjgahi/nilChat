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
  socket.on('register', (payload) => {
    socket.join(payload.meetingId)
    userConnections.push({
        connectionId: socket.id,
        ...payload,
      })
    io.to(payload.meetingId).emit('updateUserList', {
      list: userConnections.filter(x => x.meetingId === payload.meetingId)
    });
  })
  socket.on('disconnect', (reason) => {
    console.log("REASON: ", reason)
    const targetData = JSON.parse(JSON.stringify(userConnections)).find(x => x.connectionId === socket.id)
    userConnections = userConnections.filter(x => x.connectionId !== socket.id)
    if(targetData)
    socket.to(targetData.meetingId).emit('userLeft', socket.id);
  })
})
server.listen(PORT, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', PORT)
})