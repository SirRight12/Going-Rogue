const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let socket = io()

const ratio = window.devicePixelRatio || 1
const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth * ratio
canvas.height = innerHeight * ratio

const x = canvas.width / 2
const y = canvas.height / 2

//const player = new Player(x, y, 10, 'white')
const players = {

}
function badrng(max,min) {
  max += 1
  return Math.floor(Math.random() * (max - min) ) + min
}
function updatePlayer(backendPlayers) {
  for (let id in backendPlayers) {
    const backendPlayer = backendPlayers[id]
    if (!players[id]) {
      players[id] = new Player(backendPlayer.x, backendPlayer.y, 10, backendPlayer.color)
    }
  }
  for (let id in players) {
    if (!backendPlayers[id]) {
      delete players[id]
    }
  }
}
socket.on("updatePlayers",(backendPlayers) => {
  for (let id in backendPlayers) {
    const backendPlayer = backendPlayers[id]
    if (!players[id]) {
      players[id] = new Player(backendPlayer.x, backendPlayer.y, 10, backendPlayer.color)
    }
  }
  for (let id in players) {
    if (!backendPlayers[id]) {
      delete players[id]
    }
  }
})
function updateLocalPositionX(sign) {
  socket.emit("UpdatethingX",socket.id,sign)
}
function updateLocalPositionY(sign) {
  socket.emit("UpdatethingY",socket.id,sign)
}
let wdown = false
let sdown = false
let adown = false
let ddown = false
let up;
let down;
let right;
let left;
document.addEventListener("keydown",function(event) {
  let keyism = event.key
  keyism = keyism.toUpperCase()
  if (keyism == 'W'&&wdown == false) {
    wdown = true
    clearInterval(up)
    clearInterval(down)
    up = setInterval(function() {
      updateLocalPositionY("negative")
    },10)
  } else if (keyism == "S"&&sdown == false) {
    sdown = true
    clearInterval(up)
    clearInterval(down)
    down = setInterval(function() {
      updateLocalPositionY("positive")
    },10)
  } else if (keyism == "A"&&adown == false) {
    adown = true
    clearInterval(left)
    clearInterval(right)
    left = setInterval(function() {
      updateLocalPositionX("negative")
    })
  } else if (keyism == "D"&&ddown == false) {
    ddown = true
    clearInterval(left)
    clearInterval(right)
    right = setInterval(function() {
      updateLocalPositionX("positive")
    })
  }
})
document.addEventListener("keyup",function(event) {
  let keyism = event.key.toUpperCase()
  if (keyism == "W") {
    wdown = false
    clearInterval(up)
  } else if (keyism == "S") {
    sdown = false
    clearInterval(down)
  } else if (keyism == "A") {
    adown = false
    clearInterval(left)
  } else if (keyism == "D") {
    ddown = false
    clearInterval(right)
  }
})
socket.on("updatePlrPos", (plrid,amt) => {
  players[plrid].x += amt
})
socket.on("updatePlrPosY", (plrid,amt) => {
  players[plrid].y += amt
})
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (let id in players) {
    let player = players[id]
    player.draw()
  }
}

animate()