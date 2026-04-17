// Simplified Dialogue Module
let dialogueData = null;
let currentTrigger = 'intro';
let currentDialogueIndex = 0;
let currentPartIndex = 0;

// Load dialogue JSON once at startup
// Reference: https://www.geeksforgeeks.org/javascript/read-json-file-using-javascript/ & https://www.geeksforgeeks.org/javascript/read-json-file-using-javascript/

function fetchDialogueData() {
    fetch('/projects/testing_project/dialogue.json')
        .then(response => response.json())
        .then(data => {
            dialogueData = data;
            updateDialogueDisplay();
        })
        .catch(error => console.error('Failed to load dialogue:', error));
}

// Cached DOM refs (set in setupDialogueInput)
let dialogueTextElement = null;
let dialogueChoicesElement = null;

// Initialize DOM references
function initDialogueDOM() {
    dialogueTextElement = document.getElementById('dialogue-text');
    dialogueChoicesElement = document.getElementById('dialogue-choices');
}

// Refresh dialogue text + buttons
function updateDialogueDisplay() {
    if (!dialogueTextElement) return;

    const text = getCurrentDialogueText();
    dialogueTextElement.textContent = text;

    // Show buttons only when choices exist
    const choices = getCurrentDialogueChoices();
    if (choices && choices.length > 0) {
        showDialogueChoices(choices);
    } else {
        hideDialogueChoices();
    }
}

// Build choice buttons
function showDialogueChoices(choices) {
    if (!dialogueChoicesElement) return;

    dialogueChoicesElement.innerHTML = ''; // Reset previous buttons
    dialogueChoicesElement.style.display = 'flex';

    choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.dataset.choice = choice;
        button.dataset.index = index; // Keep original choice index
        // Ref: dataset -> https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
        button.addEventListener('click', () => {
            selectChoice(parseInt(button.dataset.index));
        });
        dialogueChoicesElement.appendChild(button);
    });
}

// Hide and clear choices
function hideDialogueChoices() {
    if (!dialogueChoicesElement) return;
    dialogueChoicesElement.style.display = 'none';
    dialogueChoicesElement.innerHTML = '';
}

// Get the active dialogue object
function getCurrentDialogue() {
    if (!dialogueData || !dialogueData[currentTrigger]) return null;
    return dialogueData[currentTrigger][currentDialogueIndex];
}

// Get formatted dialogue text
function getCurrentDialogueText() {
    const dialogue = getCurrentDialogue();
    if (!dialogue) return "Loading...";

    const text = dialogue[`t${currentPartIndex + 1}`];
    return text ? `${dialogue.name}: ${text}` : "...";
}

// Get choices for this dialogue entry (if any)
function getCurrentDialogueChoices() {
    const dialogue = getCurrentDialogue();
    return dialogue ? dialogue.next : null;
}

// Move forward one dialogue step
function advanceDialogue() {
    const dialogue = getCurrentDialogue();
    if (!dialogue) return;

    // Stop here if player needs to choose
    if (getCurrentDialogueChoices()) return;

    // Check if there's a next part
    if (dialogue[`t${currentPartIndex + 2}`]) {
        currentPartIndex++;
    } else {
        // Otherwise go to next dialogue entry
        currentDialogueIndex++;
        currentPartIndex = 0;

        // End of branch behavior
        if (currentDialogueIndex >= dialogueData[currentTrigger].length) {
            // Ending finishes the game instead of looping
            if (currentTrigger === 'ending') {
                if (typeof window.onEndingComplete === 'function') {
                    window.onEndingComplete();
                }
                return;
            }

            // *_afterTrigger branches bounce back to their base location
            if (currentTrigger.endsWith('_afterTrigger')) {
                const baseTrigger = currentTrigger.replace('_afterTrigger', '');
                setDialogueTrigger(baseTrigger);
                return;
            }

            // Regular branches loop
            currentDialogueIndex = 0;
        }
    }

    updateDialogueDisplay();
    notifyDialogueChange();
}

// Jump to a different dialogue branch
function setDialogueTrigger(trigger) {
    currentTrigger = trigger;
    currentDialogueIndex = 0;
    currentPartIndex = 0;
    updateDialogueDisplay();
    notifyDialogueChange();
}

// Apply selected choice
function selectChoice(choiceIndex) {
    const choices = getCurrentDialogueChoices();
    if (!choices || choiceIndex < 0 || choiceIndex >= choices.length) return;

    setDialogueTrigger(choices[choiceIndex]);
}

// Tell script.js that dialogue state changed
function notifyDialogueChange() {
    if (typeof window.onDialogueChange === 'function') {
        const dialogue = getCurrentDialogue();
        window.onDialogueChange({
            trigger: currentTrigger,
            dialogue: dialogue,
            index: currentDialogueIndex,
            part: currentPartIndex
        });
    }
}

// Setup keyboard input for dialogue
// Ref: KeyboardEvent.key -> https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
function setupDialogueInput() {
    initDialogueDOM();

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // If item popup is open, close it first
            if (window.isMediaBoxOpen && window.isMediaBoxOpen()) {
                window.closeMediaBox();
            } else {
                advanceDialogue();
            }
            event.preventDefault();
        }
    });
}
