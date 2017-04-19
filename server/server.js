const express = require("express");
const socket = require("socket.io");
const path = require("path");
const GameManager = require("./GameManager");
const determineWinner = require("./rockPaperScissors");
console.log("THIS SERVER IS BEING INITIATED!!!!")
const app = express();

app.use(express.static("app"));;
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname,"..", "app", "home.html"));
})
app.get("/rockPaperScissors", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "app", "rockPaperScissors.html"))
})
app.get("/ticTacToe", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "app", "ticTacToe.html"))
})
app.get("/loading", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "app", "loading.html"))
})

const server= app.listen(8000, () => console.log("running on port 8000"))

const io = socket(server)
let gameManager = new GameManager(io)

io.on("connection", (socket) => {    
    socket.on("play online", () => {
        gameManager.addPlayer(socket)
    })

    socket.on("choose team", (team) => {
        console.log(`player choose to be: ${team}`);
        let removalIndex = teams.indexOf(team);
        teams.splice(removalIndex, 1);
        console.log(teams);
    })

    socket.on("move", (data) => io.emit("move", data))

    socket.on("reset", () => io.emit("reset"))

    socket.on("RPC move", (choice) => {
        console.log(`players choice: ${choice}`)
        gameManager.rockPaperScissors(choice, socket)
    })
})

module.exports.server = server
module.exports.socket = io
module.exports.gameManager = gameManager