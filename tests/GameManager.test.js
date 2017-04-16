const chai = require("chai")
const expect = chai.expect
const should = chai.should()
const io = require("socket.io-client")
const colors = require("colors")


describe("GameManager", () => {
    let GameManager
    let client
    let server
    let serverSocket
    beforeEach((done) => {
        server = require("../server/server.js").server
        serverSocket = require("../server/server.js").socket
        GameManager = new (require("../server/GameManager"))(serverSocket)
        client = io("http://localhost:8000")
        done()
    })
    it("should add a player to a game room", (done) => {
        let playerWasAdded = false;

        client.on("connect", () => {
            GameManager.addPlayer(client)

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
            GameManager.addSpectator(client)

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
        GameManager.addPlayer(client)
        GameManager.gameRooms.length.should.equal(1)

        client.disconnect()
        done()
    })
    it("should have 1 game room setup after adding 2 players", (done) => {
        let client2 = io("http://localhost:8000")
        GameManager.addPlayer(client)
        GameManager.gameRooms.length.should.equal(1)

        client.disconnect()
        done()
    })
    it("should have 2 game rooms setup after adding 3 players", (done) => {
        let client2 = io("http://localhost:8000")
        let client3 = io("http://localhost:8000")

        GameManager.addPlayer(client)
        GameManager.addPlayer(client2)
        GameManager.addPlayer(client3)

        GameManager.gameRooms.length.should.equal(2)

        client.disconnect()
        client2.disconnect()
        client3.disconnect()
        done()
    })
    it("should have 2 game rooms setup after adding 4 players", (done) => {
        let client2 = io("http://localhost:8000")
        let client3 = io("http://localhost:8000")
        let client4 = io("http://localhost:8000")
       
        GameManager.addPlayer(client)
        GameManager.addPlayer(client2)
        GameManager.addPlayer(client3)
        GameManager.addPlayer(client4)

        GameManager.gameRooms.length.should.equal(2)

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
            GameManager.addPlayer(client)

            client.on("game ready", (data) => {
                clientWasAlerted = true
                client.disconnect()
            })
        })
        client2.on("connect", () => {
            GameManager.addPlayer(client2)

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
})