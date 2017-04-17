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
            let isTileSet = tile.classList.contains("x") || tile.classList.contains("o");

            if(isTileSet) {
                alert("That tile has already been chosen! Go again...");
                return;
            }

            socket.emit("move", data);
    }

    function handleMove({tileIndex}) {
            let tile = $(".tile").filter(index => index === tileIndex)[0];
            
            if(isPlayer1Turn) {
                tile.classList.add("o");
                isPlayer1Turn = false;
            } else {
                tile.classList.add("x");
                isPlayer1Turn = true;
            }
            isGameOver();
    }

    function handleReset() {
        socket.emit("reset");
    }
    function resetBoard() {
        $(".tile").removeClass("o")
                .removeClass("x");
    }
    function isGameOver() {
        let player1Tiles = $(".o").map((index, tile) => $(tile).data("index"));
        let player2Tiles = $(".x").map((index, tile) => $(tile).data("index"));
        player1Tiles = Array.from(player1Tiles);
        player2Tiles = Array.from(player2Tiles);

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
        let player1Won = false;
        let player2Won = false;
        winningIndexes.forEach(path => {
            let p1Matches = path.filter(index => player1Tiles.indexOf(index) !== -1);
            let p2Matches = path.filter(index => player2Tiles.indexOf(index) !== -1);
            if(p1Matches.length === 3) {
                player1Won = true;
            } else if(p2Matches.length === 3) {
                player2Won = true;
            }

        })

        if(player1Won) {
            gameOver("player1");
        } else if(player2Won) {
            gameOver("player2");
        }
    }

    function gameOver(player) {
        alert(`${player} won the game!!!`);
    }
})

