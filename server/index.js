const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
app.use(cors())

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.static(path.join(__dirname, './dist/')))

app.post('/api/joinRoom', (req, res) => {
  console.log(req.body);
  res.send(req.body)
})

io.on('connection', socket => {
  console.log('user connected', socket.id);

  socket.broadcast.emit('newUser', socket.id);

  socket.on('offer', sdp => {
    socket.broadcast.emit('offer', sdp)
  })

  socket.on('answer', sdp => {
    socket.broadcast.emit('answer', sdp)
  })
  
  socket.on('candidate', candidate => {
    socket.broadcast.emit('candidate', candidate)
  })

  socket.on('disconnect', () => {
    console.log('user disconnectd', socket.id);
  })
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './dist/index.html')))

server.listen(PORT, () => console.log(`app running on http://localhost:${PORT}`))