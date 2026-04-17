window.onload = setup;

function setup() {
    console.log("js script started!");
    //get the context
    const canvas = document.getElementById("testCanvas");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    const startBtn = document.getElementById("Button");

    let dialogueData = null;
    let characters = {};

    // set a default fill style for drawing
    ctx.fillStyle = "rgba(255,0,0,255)";

    //create an array of images to load
    const imagesToLoad = ["src/IMG_2102.jpg", "src/IMG_2103.jpg"];
    const loadedImages = {};

    //add the image to the canvas based on its index in the array
    imagesToLoad.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
            loadedImages[src] = img;
            if (index === 0) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };
        img.src = src;
    });
    
    // load JSON (dialogue.json) and store it in dialogueData, then index dialogue lines by character for easy retrieval
    function fetchJSONData() {
        fetch('/projects/testing_project/dialogue.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                dialogueData = data;
                console.log("Dialogue data loaded:", data);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    }
    fetchJSONData();


    // simple overlay UI (created once) to display dialogue text and choices 
    const overlay = document.createElement("div");
    overlay.id = "simple-dialogue";
    Object.assign(overlay.style, {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        padding: "12px",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        fontFamily: "Roboto, sans-serif",
        display: "none",
        boxSizing: "border-box",
    });
    // text and buttons containers
    const textEl = document.createElement("div");
    const buttonsEl = document.createElement("div");
    buttonsEl.style.marginTop = "8px";
    overlay.appendChild(textEl);
    overlay.appendChild(buttonsEl);
    document.body.appendChild(overlay);

    // function to show dialogue with text and choices
    function showDialogue(text, choices) {
        textEl.textContent = text;
        buttonsEl.innerHTML = ""; // clear previous buttons
        choices.forEach(choice => {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.style.marginRight = "8px";
            button.addEventListener("click", () => {
                overlay.style.display = "none";
                // handle choice selection
                console.log("Selected choice:", choice.text);
            });
            buttonsEl.appendChild(button);
        });
        overlay.style.display = "block";
    };
}


