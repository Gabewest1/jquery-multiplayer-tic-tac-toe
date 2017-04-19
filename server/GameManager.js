const determineWinner = require("./rockPaperScissors")

class GameManager {
    constructor(serverSocket) {
        this.gameRooms = [];
        this.gameRoomCounter = 0;
        this.socket = serverSocket;
    }
    addPlayer(player) {
        let gameRoom = this.getOpenGame()
        gameRoom.players.push(player)
        this.messageGameRoom(gameRoom.id, "player joined")
        this.isGameRoomReady(gameRoom)
    }
    addSpectator(spectator) {
        let gameRoom = this.getOpenGame()
        gameRoom.spectators.push(spectator)
        this.messageGameRoom(gameRoom.id, "spectator joined")
    }
    createGameRoom() {
        let newGameRoom = {
            id: this.gameRoomCounter++,
            players: [],
            spectators: [],
            rockPaperScissors: []
        }
        this.gameRooms.push(newGameRoom);
        return newGameRoom
    }
    endGame(gameRoom) {
        let playersRoom = this.gameRooms.filter(room => room.id === gameRoom.id)[0]
        playersRoom.players.forEach(player => player.disconnect())
        playersRoom.spectators.forEach(spectator => spectator.disconnect())
        this.gameRooms = this.gameRooms.filter(room => room.id !== playersRoom.id)
    }
    isGameRoomReady(gameRoom) {
        if(gameRoom.players.length === 2) {
            this.messageGameRoom(gameRoom.id, "game ready")
        }
    }
    messageGameRoom(gameRoomId, eventName, data) {
        let gameRoom = this.gameRooms.filter(room => room.id === gameRoomId)[0]
        gameRoom.players.forEach(player => this.socket.to(player.id).emit(eventName, data))
        gameRoom.spectators.forEach(player => this.socket.to(player.id).emit(eventName, data))
    }
    getOpenGame() {
        let firstOpenGame;
        if(this.gameRooms.length === 0) {
            firstOpenGame = this.createGameRoom()
            return firstOpenGame
        }
        for(var i=0; i<this.gameRooms.length; i++) {
            let currentGameRoom = this.gameRooms[i]
            if(currentGameRoom.players.length === 1) {
                firstOpenGame = currentGameRoom
                return firstOpenGame
            }
        }

        return this.createGameRoom()
    }
    rockPaperScissors(choice, player) {
        let playersGameRoom = this.findPlayersGameRoom(player)
        console.log(`found players game room: ${playersGameRoom}`)
        playersGameRoom.rockPaperScissors.push({socket: player, choice})
        
        if(playersGameRoom.rockPaperScissors.length === 2) {
            console.log("dispatching a winner")
            this.dispatchRockPaperScissorsWinner(playersGameRoom)
        }
    }
    dispatchRockPaperScissorsWinner(gameRoom) {
        let players = gameRoom.rockPaperScissors
        let winner = determineWinner(players[0].choice, players[1].choice)
        winner = (winner === "p1") ? players[0].socket.id : players[1].socket.id

        this.messageGameRoom(gameRoom.id, "RPC results", winner)
    }
    findPlayersGameRoom(player) {
        let gameRoom
        for(var i=0; i<this.gameRooms.length; i++) {
            let currentRoom = this.gameRooms[i]
            if(currentRoom.players.indexOf(player) >= 0) {
                gameRoom = currentRoom
            }
        }

        return gameRoom
    }
}

module.exports = GameManager