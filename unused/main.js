
window.onload = function () {
    console.log("events!")
    // get the canvas
    let canvas = document.getElementById("testCanvas");
    //get the context
    let context = canvas.getContext("2d");

    //start the game loop after clicking start btn
    document.getElementById("startBtn").addEventListener("click", function () {
        console.log("start game loop")
        // Hide the start content (title and button), but keep ASCII overlay
        document.getElementById("start-content").style.display = "none";
        gameLoop();
    });

    function gameLoop() {
        //clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //draw ascii overlay



    }

    //start in empty room
    drawEmptyRoom();
    //TODO: add event listeners for player movement and interactions here
    // Example: document.addEventListener("keydown", handleKeyDown);



}