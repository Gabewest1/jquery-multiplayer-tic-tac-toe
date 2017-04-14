$(document).ready(() => {
    $("#playOnline").click(playOnlineHandler);
})

function playOnlineHandler(e) {
    console.log("play online clicked!");
    $.ajax("/loading.html").then(response => $(document.body).html(response));
}