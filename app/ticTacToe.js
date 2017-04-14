$(document).ready(() => {
    const socket = io();
    socket.on("move", handleMove);
    socket.on("reset", resetBoard);
    socket.on("chooseTeam", chooseTeam);

    let isPlayer1Turn = true;
    let isPlayer1;

    console.log("running");
    $(".tile").click(handleTileClick);

    let resetGameButton = $("#reset").click(handleReset);

    /*Functions to handle game rules below */
    function chooseTeam(teams, cb) {
        let answer = "";
        while(answer.length !== 1) {
            answer = prompt(`Choose a team: ${teams.join(" ")}`);
            answer = answer.toLowerCase();
            answer = answer.trim();
            // console.log(answer);
            // console.log(!!answer.match(/[xo]/));
            if(!answer.match(/[xo]/)) {answer = ""};
            console.log(answer.length);
            // if(answer.length === 1) {
            //     break;
            // }
        }

        if(answer === "x") {
            isPlayer1 = true;
            cb("X");
        } else if(answer === "o") {
            isPlayer1 = false;
            cb("O");
        }
    }

    function handleTileClick(e) {
            console.log("that tickled c:");
            if(isPlayer1Turn && !isPlayer1 || !isPlayer1Turn && isPlayer1) {
                return;
            }
            let tile = e.target;
            let data = {tileIndex: $(tile).data("index")};
            let isTileSet = tile.classList.contains("blue") || tile.classList.contains("red");

            if(isTileSet) {
                alert("That tile has already been chosen! Go again...");
                return;
            }

            socket.emit("move", data);
    }

    function handleMove({tileIndex}) {
            let tile = $(".tile").filter(index => index === tileIndex)[0];
            
            if(isPlayer1Turn) {
                tile.classList.add("red");
                isPlayer1Turn = false;
            } else {
                tile.classList.add("blue");
                isPlayer1Turn = true;
            }
            isGameOver();
    }

    function handleReset() {
        socket.emit("reset");
    }
    function resetBoard() {
        $(".tile").removeClass("red")
                .removeClass("blue");
    }
    function isGameOver() {
        console.log("isGameOver is running");
        let player1Tiles = $(".red").map((index, tile) => $(tile).data("index"));
        let player2Tiles = $(".blue").map((index, tile) => $(tile).data("index"));
        player1Tiles = Array.from(player1Tiles);
        player2Tiles = Array.from(player2Tiles);
        
        console.log(player1Tiles);
        console.log(player2Tiles);
        let winningIndexes = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [6,4,2]
        ]
        let didPlayer1Win = false;
        let didPlayer2Win = false;
        winningIndexes.forEach(path => {
            let p1Matches = path.filter(index => player1Tiles.indexOf(index) !== -1);
            let p2Matches = path.filter(index => player2Tiles.indexOf(index) !== -1);
            if(p1Matches.length === 3) {
                didPlayer1Win = true;
            } else if(p2Matches.length === 3) {
                didPlayer2Win = true;
            }

        })

        if(didPlayer1Win) {
            gameOver("player1");
        } else if(didPlayer2Win) {
            gameOver("player2");
        }
    }

    function gameOver(player) {
        alert(`${player} won the game!!!`);
    }
})

