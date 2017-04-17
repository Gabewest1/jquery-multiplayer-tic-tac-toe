$(document).ready(() => {
    $("#playOnline").click(playOnlineHandler);
})

function playOnlineHandler(e) {
    console.log("play online clicked!");
    $.ajax("/loading.html").then(response => $(document.body).html(response));
}

function handleFoundOpponent() {
    $("body").html(`<h1>Found Opponent!</h1>`)
    setTimeout(() => {
        window.location.replace("/ticTacToe")
    }, 3000)
}