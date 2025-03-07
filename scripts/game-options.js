/* Viktor Högberg, Léo Tuomenoksa Texier */

import { gameManager, showGameOverDialog } from "./game.js";
import { getIncorrectMoves } from "./points.js";

let livesEnabled = false;
let timeEnabled = false;
let pointsEnabled = false;

let difficulty = "";

export function handleGameOptions() {
    handleGamePreferences();
    handleGameMode();
    handleGameDifficulty();
}

// Hide the different game preferences initially, with null check since sandbox sort does not have them
document.getElementById("lives-container").classList.add("hidden");
document.getElementById("time-container").classList.add("hidden");

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

function handleGameDifficulty() {

    const allElements = document.querySelectorAll(".game-element-normal, .game-element-hard");
    allElements.forEach(element => {
        element.classList.remove("hidden");
    });

    // Easy
    if (document.getElementById("easy-difficulty").checked) {

        difficulty = "easy";

        const elementsToHide = document.querySelectorAll(".game-element-normal, .game-element-hard");
        elementsToHide.forEach(elementsToHide => {
            elementsToHide.classList.add("hidden");
        });
    }

    // Normal
    if (document.getElementById("normal-difficulty").checked) {
        difficulty = "normal";

        const elementsToHide = document.querySelectorAll(".game-element-hard");
        elementsToHide.forEach(elementsToHide => {
            elementsToHide.classList.add("hidden");
        });
    }

    // Hard
    if (document.getElementById("hard-difficulty").checked) {
        difficulty = "hard";
    }
}

// ==================================================================
// ============================= LIVES ==============================
// ==================================================================

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
    let startTime = 60;
    const currentTime = document.getElementById("countdown");
    document.getElementById("countdown").textContent = "0:" + startTime;

    interval = setInterval(function () {
        startTime--;

        // display time either like 0:34 or 0:03, not 0:3.
        if (startTime > 9) {
            currentTime.textContent = "0:" + startTime;
        }
        else if (startTime <= 9) {
            currentTime.textContent = "0:0" + startTime;
        }

        if (startTime <= 0) { // time is up
            clearInterval(interval);
            timeIsUp();
        }
    }, 100) //TODO() change to 1000 ms (1 second)
}

function timeIsUp() {
    timeRanOut = true;
    gameManager.gameOver();
}

export function didTimeRunOut() {
    return timeRanOut;

}

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