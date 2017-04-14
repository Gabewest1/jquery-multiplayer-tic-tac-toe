const express = require("express");
const socket = require("socket.io");
const path = require("path");
const GameManager = require("./GameManager");
const determineWinner = require("./rockPaperScissors");

const app = express();

app.use(express.static("app"));;
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname,"..", "app", "home.html"));
})
app.get("/ticTacToe", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "app", "ticTacToe.html"))
})
app.get("/loading", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "app", "loading.html"))
})

const server= app.listen(8000, () => console.log("running on port 8000"))

let teams = ["X", "O"]
const io = socket(server)
io.on("connection", (socket) => {
    io.emit("reset")
    
    socket.on("playOnline", () => {
        GameManager.addPlayer(socket)
        GameManager.showGames()
    })
    socket.on("foundPlayer", () => {
        
    })

    // console.log(`${socket.id} connected to the game`);

    socket.emit("chooseTeam", teams, (team) => {
        console.log(`player choose to be: ${team}`);
        let removalIndex = teams.removalIndexOf(team);
        teams.splice(index, 1);
        console.log(teams);
    });

    socket.on("move", (data) => io.emit("move", data))

    socket.on("reset", () =>io.emit("reset"))

    socket.on("echo", function (msg, callback) {
        callback = callback || function () {};
 
        socket.emit("echo", msg);
        callback(null, "Done.");
    });

    socket.on("RPC move", (choice) => {
        let winner = determineWinner(choice[0], choice[1])
        console.log(winner)
        io.emit("RPC winner", winner)
    })
})

module.exports.server = server;
module.exports.socket = io;