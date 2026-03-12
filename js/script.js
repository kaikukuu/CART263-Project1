window.onload = function () {
    console.log("events!")
    // get the canvas
    let canvas = document.getElementById("testCanvas");
    //get the context
    let context = canvas.getContext("2d");
    let itemLayer = null;
    let isGameReady = false;

    //reference for using the canvas API: https://www.w3schools.com/jsref/api_canvas.asp

    function resizeCanvas() {
        const ratio = 500 / 500;          // Keep a square canvas (1:1)
        const maxWidth = window.innerWidth * 0.9;  // 90% of viewport width
        const maxHeight = window.innerHeight * 0.9; // 90% of viewport height

        // Fit canvas in the viewport while keeping that ratio
        let w = maxWidth;
        let h = w / ratio;

        // If it's too tall, scale by height instead
        if (h > maxHeight) {
            h = maxHeight;
            w = h * ratio;
        }

        canvas.width = w;
        canvas.height = h;
        if (isGameReady) {
            updateItemLayer();
        }
    }

    window.addEventListener('resize', resizeCanvas);
    itemLayer = document.getElementById('item-layer');
    resizeCanvas();

    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const endScreen = document.getElementById('end-screen');

    // Load dialogue data first
    fetchDialogueData();
    // (setupDialogueInput will be called later once helper functions like
    // closeMediaBox/isMediaBoxOpen are defined)

    // Location -> collectible items
    const locations = {
        "clearing": [
            { x: 150, y: 200, width: 50, height: 50, smallImg: 'src/imgs/CAP1.png', zoomedImg: 'src/imgs/CAP1.png', collected: false },
            { x: 300, y: 150, width: 50, height: 50, smallImg: 'src/imgs/CAP2.png', zoomedImg: 'src/imgs/CAP2.png', collected: false }
        ],
        "forest": [
            { x: 200, y: 250, width: 50, height: 50, smallImg: 'src/imgs/CAP1.png', zoomedImg: 'src/imgs/CAP1.png', collected: false },
            { x: 350, y: 100, width: 50, height: 50, smallImg: 'src/imgs/CAP2.png', zoomedImg: 'src/imgs/CAP2.png', collected: false }
        ],
        "town": [
            { x: 100, y: 300, width: 50, height: 50, smallImg: 'src/imgs/CAP1.png', zoomedImg: 'src/imgs/CAP1.png', collected: false },
            { x: 250, y: 200, width: 50, height: 50, smallImg: 'src/imgs/CAP2.png', zoomedImg: 'src/imgs/CAP2.png', collected: false }
        ]
    };

    // Preload item images for every location
    Object.values(locations).forEach(locationItems => {
        locationItems.forEach((item) => {
            // Turn string paths into Image objects
            const smallImgObj = new Image();
            smallImgObj.src = item.smallImg;
            item.smallImg = smallImgObj;

            const zoomedImgObj = new Image();
            zoomedImgObj.src = item.zoomedImg;
            item.zoomedImg = zoomedImgObj;
        });
    });

    let currentBackgroundImg = null;
    let currentForegroundImg = null;
    let currentForegroundSize = { width: null, height: null };
    let backgroundVisible = false;
    let currentTrigger = 'intro'; // Which dialogue branch we're in right now
    let currentLocation = "clearing"; // Current playable area
    let items = locations[currentLocation]; // Items for the current area
    let gameState = 'start'; // start, video, dialogue, end
    let video;
    let firstDialogueAdvance = true;
    let introComplete = false; // True once intro hits its last entry

    // Main callback from dialogue.js whenever text/trigger changes
    window.onDialogueChange = function (data) {
        const { trigger, dialogue, index, part } = data;
        currentTrigger = trigger; // Used by rendering + click logic

        // After video ends, first Enter just reveals the scene
        if (gameState === 'dialogue' && firstDialogueAdvance) {
            // Queue background first, then reveal
            if (dialogue.background) {
                loadBackgroundImage(dialogue.background);
            }
            backgroundVisible = true;
            firstDialogueAdvance = false;
            return;
        }

        // When intro loops back to index 0, start the video
        if (trigger === 'intro' && index === 0 && introComplete) {
            gameState = 'video';
            video.play();
            introComplete = false; // Reset in case intro is replayed
            return;
        }

        // Mark intro as complete when it reaches its last line
        if (trigger === 'intro' && dialogueData && dialogueData.intro && index === dialogueData.intro.length - 1) {
            introComplete = true;
        }

        // If trigger is a playable location, switch active items list
        if (locations[trigger] && trigger !== currentLocation) {
            currentLocation = trigger;
            items = locations[currentLocation];
        }

        // Update background from dialogue entry
        if (dialogue.background) {
            loadBackgroundImage(dialogue.background);
            backgroundVisible = true;
        }

        // Update optional foreground overlay from dialogue entry
        if (dialogue.foreground) {
            currentForegroundImg = null;
            currentForegroundSize = dialogue.foregroundWidth ?
                { width: dialogue.foregroundWidth, height: null } :
                { width: null, height: null };
            loadForegroundImage(dialogue.foreground);
        } else {
            currentForegroundImg = null;
            currentForegroundSize = { width: null, height: null };
        }

        updateItemLayer();
    };

    // Quick check for current location only
    window.checkItemsCollected = function () {
        return items.every(item => item.collected);
    };

    // Check if all six items are collected across all locations
    // Ref: Array.every -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
    window.checkAllItemsCollected = function () {
        return Object.values(locations).every(locationItems =>
            locationItems.every(item => item.collected)
        );
    };

    // Called by dialogue.js when ending dialogue is done
    window.onEndingComplete = function () {
        gameState = 'end';
        backgroundVisible = false;
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.style.display = 'none';
        }
        if (endScreen) {
            endScreen.style.display = 'flex';
        }
        if (itemLayer) {
            itemLayer.style.display = 'none';
            itemLayer.innerHTML = '';
        }
        window.closeMediaBox();
    };

    // Hide the media popup
    window.closeMediaBox = function () {
        const mediaBox = document.getElementById('media-box');
        if (mediaBox) {
            mediaBox.style.display = 'none';
        }
    };

    // Let dialogue.js know if media popup is open
    window.isMediaBoxOpen = function () {
        const mediaBox = document.getElementById('media-box');
        return mediaBox && mediaBox.style.display === 'block';
    };

    // Safe to bind Enter key controls now
    setupDialogueInput();

    // Setup media box close button
    const closeMediaBtn = document.getElementById('close-media');
    if (closeMediaBtn) {
        closeMediaBtn.addEventListener('click', window.closeMediaBox);
    }

    // Configure intro cutscene video
    video = document.createElement('video');
    video.src = "src/onlyComet.mp4";
    video.preload = 'auto';
    video.playbackRate = 4; // Speed up the video (2x speed)
    video.addEventListener('ended', function () {
        gameState = 'dialogue';
        backgroundVisible = false;
        firstDialogueAdvance = true;
        window.setDialogueTrigger("clearing");
    });

    // Start game from DOM button
    function startGame() {
        gameState = 'dialogue';
        if (startScreen) {
            startScreen.style.display = 'none';
        }
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.style.display = 'block';
        }
        window.setDialogueTrigger("intro");
        firstDialogueAdvance = false;
        updateItemLayer();
    }

    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    isGameReady = true;

    // Main render loop
    // Ref: requestAnimationFrame -> https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
    function fadeEffect() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1.0;

        if (gameState === 'start') {
            // Start screen is DOM-based, just keep canvas dark behind it
            context.fillStyle = "rgb(0, 0, 0)";
            context.fillRect(0, 0, canvas.width, canvas.height);
        } else if (gameState === 'video') {
            // Cutscene video
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        } else if (gameState === 'dialogue') {
            // Base fill behind dialogue scenes
            context.fillStyle = "rgb(0, 0, 0)";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Draw scene background once available
            if (backgroundVisible && currentBackgroundImg) {
                // Cover canvas while keeping image ratio
                // Ref: drawImage -> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
                const scale = Math.max(canvas.width / currentBackgroundImg.width, canvas.height / currentBackgroundImg.height);
                const scaledWidth = currentBackgroundImg.width * scale;
                const scaledHeight = currentBackgroundImg.height * scale;
                const x = (canvas.width - scaledWidth) / 2;
                const y = (canvas.height - scaledHeight) / 2;
                context.drawImage(currentBackgroundImg, x, y, scaledWidth, scaledHeight);
            }

            // Draw optional foreground layer on top of background
            if (backgroundVisible && currentForegroundImg) {
                if (currentForegroundSize.width && currentForegroundSize.height) {
                    // If dialogue gave a size, center it
                    const fx = (canvas.width - currentForegroundSize.width) / 2;
                    const fy = (canvas.height - currentForegroundSize.height) / 2;
                    context.drawImage(currentForegroundImg, fx, fy, currentForegroundSize.width, currentForegroundSize.height);
                } else {
                    // default to cover canvas but maintain ratio
                    context.drawImage(currentForegroundImg, 0, 0, canvas.width, canvas.height);
                }
            }
        } else if (gameState === 'end') {
            // End screen is DOM-based, keep canvas dark behind it
            context.fillStyle = "rgb(0, 0, 0)";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        requestAnimationFrame(fadeEffect);
    }
    fadeEffect();

    // Load a background image from dialogue data
    function loadBackgroundImage(backgroundSrc) {
        if (backgroundSrc) {
            let backgroundImg = new Image();
            backgroundImg.onload = function () {
                currentBackgroundImg = backgroundImg;
            }
            backgroundImg.src = backgroundSrc;
        }
    }

    // Load an optional foreground image from dialogue data
    function loadForegroundImage(foregroundSrc) {
        if (foregroundSrc) {
            let foregroundImg = new Image();
            foregroundImg.onload = function () {
                currentForegroundImg = foregroundImg;
            }
            foregroundImg.src = foregroundSrc;
        }
    }

    // Show the media popup for collected items
    function drawMediaBox(imageOrSrc) {
        const mediaBox = document.getElementById('media-box');
        const mediaImage = document.getElementById('media-image');

        if (!mediaBox || !mediaImage) return;

        // Accept either an Image object or a plain string path
        if (imageOrSrc instanceof Image) {
            mediaImage.src = imageOrSrc.src;
        } else {
            mediaImage.src = imageOrSrc;
        }

        mediaBox.style.display = 'block';
    }

    function collectItem(item) {
        if (!item || item.collected) return;

        drawMediaBox(item.zoomedImg);
        item.collected = true;
        updateItemLayer();

        if (window.checkAllItemsCollected()) {
            window.setDialogueTrigger('ending');
        } else {
            window.setDialogueTrigger(`${currentLocation}_afterTrigger`);
        }
    }

    // Render collectible items as DOM nodes aligned to the canvas
    // Ref: getBoundingClientRect -> https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    function updateItemLayer() {
        if (!itemLayer) return;

        const shouldShowItems =
            gameState === 'dialogue' &&
            backgroundVisible &&
            currentTrigger !== 'intro' &&
            currentTrigger !== 'ending';

        itemLayer.innerHTML = '';

        if (!shouldShowItems) {
            itemLayer.style.display = 'none';
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;

        itemLayer.style.display = 'block';

        items.forEach((item) => {
            if (item.collected || !item.smallImg || !item.smallImg.complete) return;

            const itemButton = document.createElement('button');
            itemButton.className = 'item-node';
            itemButton.style.left = `${rect.left + item.x * scaleX}px`;
            itemButton.style.top = `${rect.top + item.y * scaleY}px`;
            itemButton.style.width = `${item.width * scaleX}px`;
            itemButton.style.height = `${item.height * scaleY}px`;

            const itemImage = document.createElement('img');
            itemImage.src = item.smallImg.src;
            itemImage.alt = 'Collectible item';
            itemButton.appendChild(itemImage);

            itemButton.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                collectItem(item);
            });

            itemLayer.appendChild(itemButton);
        });
    }
}
