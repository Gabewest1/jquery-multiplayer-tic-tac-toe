class GameManager {
    constructor(serverSocket) {
        this.gameRooms = [];
        this.gameRoomCounter = 0;
        this.socket = serverSocket;
    }

    showGames() {
        this.gameRooms.forEach(room => console.log(room))
    }

    createGameRoom() {
        let newGameRoom = {
            id: this.gameRoomCounter++,
            players: [],
            spectators: []
        }
        this.gameRooms.push(newGameRoom);
        return newGameRoom
    }

    addPlayer(player) {
        let openGame = this.getOpenGame()
        openGame.players.push(player)
        this.messageGameRoom(openGame.id, "player joined")
    }

    addSpectator(spectator) {
        let openGame = this.getOpenGame()
        openGame.spectators.push(spectator)
        this.messageGameRoom(openGame.id, "spectator joined")
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
                firstOpenGame = currentGameRoom;
                return firstOpenGame
            }
        }

        return this.createGameRoom()
    }

    findGame() {
        
    }
    findPlayersGame(player) {

    }
    getPlayers(gameRoom) {
        return this.gameRooms[gameRoom];
    }
}

module.exports = GameManager;