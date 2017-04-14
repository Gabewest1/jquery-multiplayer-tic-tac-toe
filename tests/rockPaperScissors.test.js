const chai = require("chai");
const determineWinner = require("../server/rockPaperScissors");
const expect = chai.expect;
const should = chai.should();
const io = require("socket.io-client");
const colors = require("colors");

describe("winner to rock paper scissors", () => {
    it("should return p1 as the winner", () => {
        expect(determineWinner("rock", "scissors")).to.equal("p1");
        expect(determineWinner("paper", "rock")).to.equal("p1");
        expect(determineWinner("scissors", "paper")).to.equal("p1");
    })
    it("should return p2 as the winner", () => {
        expect(determineWinner("rock", "paper")).to.equal("p2");
        expect(determineWinner("paper", "scissors")).to.equal("p2");
        expect(determineWinner("scissors", "rock")).to.equal("p2");
    })
    it("should return draw", () => {
        expect(determineWinner("rock", "rock")).to.equal("draw");
        expect(determineWinner("paper", "paper")).to.equal("draw");
        expect(determineWinner("scissors", "scissors")).to.equal("draw");
    })
})

describe("echo", () => {
    let server,
        client,
        options = {
            transports: ["websocket"],
            "forceNew": true
        }
    beforeEach((done) => {
        server = require("../server/server.js").server;
        client = io.connect("http://localhost:8000", options);
        done();
    })
    it("echos message", function (done) {
        client.on("connect", function () {
            client.on("echo", function (message) {
                message.should.equal("Hello World");

                client.disconnect();
                done();
            });
        
            client.emit("echo", "Hello World");
        });
    });
    it("displays RPC winner", (done) => {
        client.on("connect", () => {
            client.on("RPC winner", (winner) => {
                winner.should.equal("p1");
                
                client.disconnect();
                done();
            })

            client.emit("RPC move", ["rock", "scissors"]);
        })
    })
})
