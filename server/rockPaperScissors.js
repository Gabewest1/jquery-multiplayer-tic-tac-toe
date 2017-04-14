function determineWinner(p1, p2) {
    let winner;
    switch(p1) {
        case "rock": {
            if(p2 === "rock") {
                winner = "draw";
            } else if(p2 === "scissors") {
                winner = "p1";
            } else if(p2 === "paper") {
                winner = "p2";
            }
        }
        break;
        case "paper": {
            if(p2 === "paper") {
                winner = "draw";
            } else if(p2 === "rock") {
                winner = "p1";
            } else if(p2 === "scissors") {
                winner = "p2";
            }
        }
        break;
        case "scissors": {
            if(p2 === "scissors") {
                winner = "draw";
            } else if(p2 === "paper") {
                winner = "p1";
            } else if(p2 === "rock") {
                winner = "p2";
            }
        }
        break;
    }
    
    return winner;
}
module.exports = determineWinner;