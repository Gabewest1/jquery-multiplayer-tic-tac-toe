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
        //The ajax request for loading.html should be retrieved and displayed first,
        //alerting the player they're searching for a match, before replacing the text
        //to alert the player a match has been found.
        if(!loadingSceenShown) {
            console.log("loadingSceen didn't show")
            setTimeout(showFoundOpponent, 1000) 
        } else {
            console.log("loadingScreen did show")
            showFoundOpponent()
        }

        function showFoundOpponent() {
            $(".loading").text(`Found Opponent!`)
            setTimeout(() => {
                $.ajax("/rockPaperScissors.html").then(response => $("body").html(response))
            }, 3000)
        }
    }
})
