/* Viktor Högberg, Léo Tuomenoksa Texier */

import { gameManager, showGameOverDialog } from "./game.js";
import { getIncorrectMoves } from "./points.js";
import { playTickingSound } from "./sound.js";

// GAME OPTIONS HANDLING

// local option variables
let livesEnabled = false;
let timeEnabled = false;
let pointsEnabled = false;
let difficulty = "";

// ran in each games start method to handle selected game options
export function handleGameOptions() {
    handleGamePreferences();
    handleGameMode();
    handleGameDifficulty();
}

// Hide the different game preferences initially, with null check since sandbox sort does not have them
document.getElementById("lives-container").classList.add("hidden");
document.getElementById("time-container").classList.add("hidden");

// local handle method for preferences
function handleGamePreferences() {
    // Lives
    if (document.getElementById("lives-checkbox").checked) {
        livesEnabled = true;
        document.getElementById("lives-container").classList.remove("hidden");
        handleLives();
    } else {
        livesEnabled = false;
        document.getElementById("lives-container").classList.add("hidden");
    }

    // Time
    if (document.getElementById("time-checkbox").checked) {
        timeEnabled = true;
        document.getElementById("time-container").classList.remove("hidden");
        handleTime();
    } else {
        timeEnabled = false;
        document.getElementById("time-container").classList.add("hidden");
    }

    // Points
    if (document.getElementById("points-checkbox").checked) {
        pointsEnabled = true;
    } else {
        pointsEnabled = false;
    }
}

// local handle method for mode
function handleGameMode() {
    // Numbers
    if (document.getElementById("number-mode").checked) {

    } else {

    }

    // Letters
    if (document.getElementById("letter-mode").checked) {

    } else {

    }

}

// local handle method for difficulty
function handleGameDifficulty() {

    // easy is never hidden, so unhide only normal and hard elements if they happen to be hidden
    const allElements = document.querySelectorAll(".game-element-normal, .game-element-hard");
    allElements.forEach(element => {
        element.classList.remove("hidden");
    });

    // Easy
    if (document.getElementById("easy-difficulty").checked) {
        difficulty = "easy";

        // hide all non-easy elements
        const elementsToHide = document.querySelectorAll(".game-element-normal, .game-element-hard");
        elementsToHide.forEach(elementsToHide => {
            elementsToHide.classList.add("hidden");
        });
    }

    // Normal
    if (document.getElementById("normal-difficulty").checked) {
        difficulty = "normal";

        // hide all hard elements
        const elementsToHide = document.querySelectorAll(".game-element-hard");
        elementsToHide.forEach(elementsToHide => {
            elementsToHide.classList.add("hidden");
        });
    }

    // Hard
    if (document.getElementById("hard-difficulty").checked) {
        // all elements shown
        difficulty = "hard";
    }
}

// ==================================================================
// ============================= LIVES ==============================
// ==================================================================

// function that handles lives, updates heart display
export function handleLives() {
    const numberOfLives = document.getElementById("number-of-lives");

    if (getIncorrectMoves() == 1) {
        numberOfLives.textContent = "❤️❤️💔";
    }
    else if (getIncorrectMoves() == 2) {
        numberOfLives.textContent = "❤️💔💔";
    }
    else if (getIncorrectMoves() == 3) {
        numberOfLives.textContent = "💔💔💔";
        showGameOverDialog();
    }
    else {
        numberOfLives.textContent = "❤️❤️❤️";
    }
}

// reset to 3 lives
export function resetLives() {
    const numberOfLives = document.getElementById("number-of-lives");
    numberOfLives.textContent = "❤️❤️❤️";
}

export function isLivesEnabled() {
    return livesEnabled;
}


// ==================================================================
// ============================= TIME ===============================
// ==================================================================

let interval;
let timeRanOut;

export function handleTime() {
    // 60 second time
    let startTime = 60;
    const currentTime = document.getElementById("countdown");
    document.getElementById("countdown").textContent = "0:" + startTime;

    // interval for timer
    interval = setInterval(function () {
        startTime--;

        // display time either like 0:34 or 0:03, not 0:3.
        if (startTime > 9) {
            currentTime.textContent = "0:" + startTime;
        }
        else if (startTime <= 9) {
            currentTime.textContent = "0:0" + startTime;
        }
        // Start counting down at 9 seconds so user panics
        if (startTime == 8) {
            playTickingSound();
        }

        if (startTime <= 0) { // time is up
            clearInterval(interval);
            timeIsUp();
        }
    }, 100)
}

// if time is up, call gameover via generalised gamemanager
function timeIsUp() {
    timeRanOut = true;
    gameManager.gameOver();
}

// export function for different game over message if time ran out
export function didTimeRunOut() {
    return timeRanOut;
}

// export function for resetting time
export function resetCountdown() {
    clearInterval(interval);
}

export function isTimeEnabled() {
    return timeEnabled;
}

// ==================================================================
// =========================== POINTS ===============================
// ==================================================================

export function isPointsDisabled() {
    return pointsEnabled;
}

// ==================================================================
// ========================= DIFFICULTY =============================
// ==================================================================

export function getDifficulty() {
    return difficulty;
}