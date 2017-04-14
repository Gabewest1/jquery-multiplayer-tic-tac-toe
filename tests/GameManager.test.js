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
    // it("should message all players in a game room of an event", (done) => {
    //     client.on("connect", () => {
    //         client.on("")
    //     })
    // })
    it("should add a player to a game room", (done) => {
        let playerWasAdded = false;

        client.on("connect", () => {
            client.on("player joined", (data) => {
                playerWasAdded = true;

                client.disconnect()
            })

            GameManager.addPlayer(client)
            setTimeout(() => {
                playerWasAdded.should.equal(true)
                done()
            }, 1000)
        })
    })
    it("should add a spectator to a game room", (done) => {
        let spectatorWasAdded = false;

        client.on("connect", () => {
            client.on("spectator joined", (data) => {
                spectatorWasAdded = true;

                client.disconnect()
            })

            GameManager.addSpectator(client)
            setTimeout(() => {
                spectatorWasAdded.should.equal(true)
                done()
            }, 1000)
        })
    })
    it("should have 2 game rooms setup after adding 3 players", (done) => {
        let client2 = io("https://localhost:8000")
        let client3 = io("https://localhost:8000")

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
        let client2 = io("https://localhost:8000")
        let client3 = io("https://localhost:8000")
        let client4 = io("https://localhost:8000")

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
})