const express = require('express')
const app = express()
const port = 3000
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {pingInterval: 2000,pingTimeout: 3000})

app.use(express.static('public'))

app.get('/', (request, result) => {
  result.sendFile(__dirname + '/index.html')
})

const players = {
  
}
function badrng(max,min) {
  max += 1
  return Math.floor(Math.random() * (max - min) ) + min
}
io.on("connection", (socket) => {
  console.log("user connected: " + socket.id)
  players[socket.id] = {
    x: badrng(100,200),
    y: badrng(100,200),
    color: `hsl(${badrng(360,1)},100%,50%)`
  }
  io.emit("updatePlayers", players)
  console.log(players)
  socket.on("disconnect", (reason) => {
    console.log(reason)
    delete players[socket.id]
    io.emit("updatePlayers", players)
  })
  socket.on("UpdatethingX", (playerid,signgiven) => {
    let newplr = players[playerid]
    let sign = 1
    if (signgiven == "negative") {
      sign = -1
    }
    let amt = 1 * sign
    newplr.x += amt 
    delete players[playerid]
    players[playerid] = newplr
    io.emit("updatePlayers", players)
    io.emit("updatePlrPos", playerid,amt)
  })
  socket.on("UpdatethingY", (playerid,signgiven) => {
    let newplr = players[playerid]
    let sign = 1
    if (signgiven == "negative") {
      sign = -1
    }
    let amt = 2 * sign
    newplr.y += amt 
    delete players[playerid]
    players[playerid] = newplr
    io.emit("updatePlayers", players)
    io.emit("updatePlrPosY", playerid,amt)
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
console.log('server loaded')