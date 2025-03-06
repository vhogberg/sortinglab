/* Viktor Högberg, Léo Tuomenoksa Texier */

import { showGameOverDialog } from "./game.js";
import { getIncorrectMoves } from "./points.js";

let livesEnabled = false;
let timeEnabled = false;
let pointsEnabled = false;

export function handleGameOptions() {
    handleGamePreferences();
    handleGameMode();
    handleGameDifficulty();
}

function handleGamePreferences() {
    // Lives
    if (document.getElementById("lives-checkbox").checked) {
        handleLives();
    } else {
        document.getElementById("lives-container").classList.add("hidden");
        livesEnabled = false;
    }

    // Time
    if (document.getElementById("time-checkbox").checked) {
        timeEnabled = true;
        document.getElementById("time-container").classList.remove("hidden");
    } else {
        document.getElementById("time-container").classList.add("hidden");
        timeEnabled = false;
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
    if (document.getElementById("easy-difficulty").checked) {

    } else {

    }

    // Letters
    if (document.getElementById("normal-difficulty").checked) {

    } else {

    }

    // Letters
    if (document.getElementById("hard-difficulty").checked) {

    } else {

    }

}

export function handleLives() {
    const numberOfLives = document.getElementById("number-of-lives");
    livesEnabled = true;
    console.log("Lives enabled");
    document.getElementById("lives-container").classList.remove("hidden");
    if (getIncorrectMoves() == 1) {
        numberOfLives.textContent = "❤️❤️💔";
    }
    else if (getIncorrectMoves() == 2) {
        numberOfLives.textContent = "❤️💔💔";
    }
    else if (getIncorrectMoves() == 3){
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

export function isPointsDisabled() {
    return pointsEnabled;
}

export function isLivesEnabled() {
    return livesEnabled;
}