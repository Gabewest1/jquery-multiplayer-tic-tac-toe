const chai = require("chai")
const expect = chai.expect
const should = chai.should()
const io = require("socket.io-client")
const colors = require("colors")


describe("GameManager", () => {
    let gameManager
    let client
    let server
    let serverSocket
    beforeEach((done) => {
        server = require("../server/server.js").server
        serverSocket = require("../server/server.js").socket
        gameManager = new (require("../server/GameManager"))(serverSocket)
        client = io("http://localhost:8000")
        done()
    })
    it("should add a player to a game room", (done) => {
        let playerWasAdded = false;

        client.on("connect", () => {
            gameManager.addPlayer(client)

            client.on("player joined", (data) => {
                playerWasAdded = true;

                client.disconnect()
            })

            setTimeout(() => {
                playerWasAdded.should.equal(true)
                done()
            }, 1000)
        })
    })
    it("should add a spectator to a game room", (done) => {
        let spectatorWasAdded = false;

        client.on("connect", () => {
            gameManager.addSpectator(client)

            client.on("spectator joined", (data) => {
                spectatorWasAdded = true;

                client.disconnect()
            })

            setTimeout(() => {
                spectatorWasAdded.should.equal(true)
                done()
            }, 1000)
        })
    })
    it("should have 1 game room setup after adding 1 players", (done) => {
        gameManager.addPlayer(client)
        gameManager.gameRooms.length.should.equal(1)

        client.disconnect()
        done()
    })
    it("should have 1 game room setup after adding 2 players", (done) => {
        let client2 = io("http://localhost:8000")
        gameManager.addPlayer(client)
        gameManager.gameRooms.length.should.equal(1)

        client.disconnect()
        done()
    })
    it("should have 2 game rooms setup after adding 3 players", (done) => {
        let client2 = io("http://localhost:8000")
        let client3 = io("http://localhost:8000")

        gameManager.addPlayer(client)
        gameManager.addPlayer(client2)
        gameManager.addPlayer(client3)

        gameManager.gameRooms.length.should.equal(2)

        client.disconnect()
        client2.disconnect()
        client3.disconnect()
        done()
    })
    it("should have 2 game rooms setup after adding 4 players", (done) => {
        let client2 = io("http://localhost:8000")
        let client3 = io("http://localhost:8000")
        let client4 = io("http://localhost:8000")
       
        gameManager.addPlayer(client)
        gameManager.addPlayer(client2)
        gameManager.addPlayer(client3)
        gameManager.addPlayer(client4)

        gameManager.gameRooms.length.should.equal(2)

        client.disconnect()
        client2.disconnect()
        client3.disconnect()
        client4.disconnect()
        done()
    }) 
    it("should alert everyone in a game room when 2 players are found and ready to start the match", (done) => {
        let client2 = io("http://localhost:8000")
        let clientWasAlerted = false
        let client2WasAlerted = false

        client.on("connect", () => {
            gameManager.addPlayer(client)

            client.on("game ready", (data) => {
                clientWasAlerted = true
                client.disconnect()
            })
        })
        client2.on("connect", () => {
            gameManager.addPlayer(client2)

            client2.on("game ready", (data) => {
                client2WasAlerted = true
                client2.disconnect()                
            })
        })

        setTimeout(() => {
            clientWasAlerted.should.equal(true)
            client2WasAlerted.should.equal(true)
            done()
        }, 3000)
    })
    it("should find the game room containing a give player's socket", (done) => {
        let foundGameRoom = false
        client.on("connect", () => {
            gameManager.addPlayer(client)
            let gameRoom = gameManager.findPlayersGameRoom(client)
            
            if(gameRoom.players.indexOf(client) !== -1) {
                foundGameRoom = true
            } else {
                foundGameRoom = false
            }

            foundGameRoom.should.equal(true)
            client.disconnect()
            done()
        })
    })
    it("should return undefined when looking for a game room that contains a given player", (done) => {
        client.on("connect", () => {
            let gameRoom = gameManager.findPlayersGameRoom(client)
            expect(gameRoom).equal(undefined)
            
            client.disconnect()
            done()
        })
    })
    it("should alert players of the rock-paper-scissors results", (done) => {
        let client2 = io("http://localhost:8000")

        client.on("connect", () => {
            client.on("RPC results", (winner) => {
                winner.should.equal(client)
                client.disconnect()
            })

            gameManager.addPlayer(client)
            client.emit("RPC move", "rock")
        })
        client2.on("connect", () => {
            client.on("RPC results", (winner) => {
                console.log(`Winner is ${winner}`)
                winner.should.equal(client)
                client2.disconnect()
            })

            gameManager.addPlayer(client2)
            client2.emit("RPC move", "scissors")
        })
        
        setTimeout(() => done(), 1000)
    })
})