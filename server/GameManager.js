class GameManager {
    constructor(serverSocket) {
        this.gameRooms = [];
        this.gameRoomCounter = 0;
        this.socket = serverSocket;
    }
    createGameRoom() {
        let newGameRoom = {
            id: this.gameRoomCounter++,
            players: [],
            spectators: [],
            rockPaperScissors: {}
        }
        this.gameRooms.push(newGameRoom);
        return newGameRoom
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
    rockPaperScissors(choice, playerId) {
        let playersGameRoom = this.findPlayersGameRoom(playerId)
        playersGameRoom.rockPaperScissors[playerId] = choice
        
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