$(document).ready(() => {
    socket.on("game ready", handleFoundOpponent)
    $("#playOnline").click(playOnlineHandler)
    let loadingSceenShown = false

    function playOnlineHandler(e) {
        console.log("play online clicked!")
        console.log(socket)
        socket.emit("play online")
        $.ajax("/loading.html").then(response => {
            $("body").html(response)
            loadingSceenShown = true
        })
    }

    function handleFoundOpponent() {
        if(!loadingSceenShown) {
            console.log("loadingSceen didn't show")
            setTimeout(showFoundOpponent, 1000) 
        } else {
            console.log("loadingScreen did show")
            showFoundOpponent()
        }

        function showFoundOpponent() {
            console.log("inner function is called")
            $("body").html(`<h1>Found Opponent!</h1>`)
            setTimeout(() => {
                window.location.replace("/ticTacToe")
            }, 3000)
        }
    }
})
