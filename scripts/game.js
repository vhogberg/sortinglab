/* Viktor Högberg, Léo Tuomenoksa Texier */

import { didTimeRunOut, getGameMode, isLivesEnabled, isPointsDisabled, isTimeEnabled, resetCountdown, resetLives } from "./game-options.js";
import { getCorrectMoves, getIncorrectMoves, isScoreGood } from "./points.js";
import { playGameOverFailSound, playGameOverSuccessSound } from "./sound.js";

const gameOverDialog = document.getElementById("game-over-dialog");

// function that checks whether the elements are sorted, either numbers or characters
export function isSorted(list) {

    // new array of the values, instead of elementList which is a nodelist
    const valueArray = [];
    for (let index = 0; index < list.length; index++) {
        valueArray[index] = list[index].textContent;
    }

    // check if we are comparing numbers or characters
    let isNumbers = true;
    if (isNaN(valueArray[0])) {
        isNumbers = false;
    }

    // start loop on i = 1 so previous isn't undefined
    for (let i = 1; i < valueArray.length; i++) {
        let current;
        let previous;

        // if game mode is numbers, do parseInt.
        if (isNumbers) {
            current = parseInt(valueArray[i]);
            previous = parseInt(valueArray[i - 1])
        }
        else {
            current = valueArray[i];
            previous = valueArray[i - 1];
        }
        // return false if it is not sorted correctly
        if (current < previous) {
            return false
        }
    }
    // return true if it is sorted correctly
    return true;
}

//shows a dialog box for when game is over
export function showGameOverDialog() {

    document.getElementById("game-over-points").textContent = "";
    document.getElementById("game-over-lives-lost").textContent = "";
    let gameOverPoints = document.getElementById("game-over-points");

    // Lives enabled AND all 3 lives lost
    if (isLivesEnabled() && getIncorrectMoves() === 3) {
        document.getElementById("game-over-title").textContent = "All lives lost!" + "\n";
        document.getElementById("game-over-lives-lost").textContent = "💔💔💔";
        if (!isPointsDisabled()) {
            gameOverPoints.textContent = "Correct moves: " + getCorrectMoves() + "\n";
            gameOverPoints.textContent += "Wrong moves: " + getIncorrectMoves();
        }
        playGameOverFailSound();
        gameOverDialog.showModal();
        return;
    }

    // Lives enabled AND time ran out
    if (isTimeEnabled() && didTimeRunOut()) {
        document.getElementById("game-over-title").textContent = "Time is up!";
        if (!isPointsDisabled()) {
            gameOverPoints.textContent = "Correct moves: " + getCorrectMoves() + "\n";
            gameOverPoints.textContent += "Wrong moves: " + getIncorrectMoves();
        }
        playGameOverFailSound();
        // resetCountdown();
        gameOverDialog.showModal();
        return;
    }

    // Game completed without hindarance and score is good!
    if (isScoreGood()) {
        // good score
        document.getElementById("game-over-title").textContent = "Congrats!";
        if (!isPointsDisabled()) {
            gameOverPoints.textContent = "Correct moves: " + getCorrectMoves() + "\n";
            gameOverPoints.textContent += "Wrong moves: " + getIncorrectMoves();
        }
        playGameOverSuccessSound();
        gameOverDialog.showModal();
        return;
    } // Game completed without hindarance and score is bad!
    else {
        // not good score
        document.getElementById("game-over-title").textContent = "Game over!";
        if (!isPointsDisabled()) {
            playGameOverFailSound(); // only play "bad" sound if user has points enabled
            gameOverPoints.textContent = "Correct moves: " + getCorrectMoves() + "\n";
            gameOverPoints.textContent += "Wrong moves: " + getIncorrectMoves() + "\n";
            gameOverPoints.textContent += "Try again to improve your result!";
            }
        gameOverDialog.showModal();
        return;
    }
}

// try again button in dialog
document.getElementById("try-again-button").addEventListener("click", () => {
    gameOverDialog.close(); // close dialog
    handleHidingElements(); // hide elements
    if (isLivesEnabled()) { // reset lives
        resetLives();
    }
    if (isTimeEnabled()) { // reset time / countdown
        resetCountdown();
    }
    resetElementValues(); // reset values so that they are in order
})


document.getElementById("return-home-button").addEventListener("click", () => {
    gameOverDialog.close();
    handleHidingElements();
    if (isLivesEnabled()) {
        resetLives();
    }
    if (isTimeEnabled()) {
        resetCountdown();
    }
    resetElementValues();
    //returns to index.html, ie the 'homescreen'
    window.location.href = "index.html";
})

// function to reset values so that they are in order
function resetElementValues() {

    let list = document.querySelectorAll(".game-element");

    if (getGameMode() === "numbers") {
        if (list.length > 15) {
            let mergeSortList = document.querySelectorAll(".game-element-row-1");
            for (let index = 0; index < mergeSortList.length; index++) {
                mergeSortList[index].innerHTML = index + 1;
            }
            mergeSortList = null;
        }
        else {
            for (let index = 0; index < list.length; index++) {
                list[index].innerHTML = index + 1;
            }
        }
    }
    else if (getGameMode() === "letters") {
        let charArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
        if (list.length > 15) {
            let mergeSortList = document.querySelectorAll(".game-element-row-1");
            for (let index = 0; index < mergeSortList.length; index++) {
                list[index].innerHTML = charArray[index];
            }
            mergeSortList = null;
        }
        else {
            for (let index = 0; index < list.length; index++) {
                list[index].innerHTML = charArray[index];
            }
        }
    }

    list = null;
}

// show theory view + game options after game is over. disable game control buttons (until game is started)
function handleHidingElements() {
    document.getElementById("about-algorithm-container").classList.remove("hidden");

    // These two are added here even if they should be unhidden by the statement below
    // because merge sort needs it since it has custom options
    document.getElementById("game-difficulty-container").classList.remove("hidden");
    document.getElementById("game-mode-container").classList.remove("hidden");

    document.getElementById("start-button").classList.remove("hidden");
    document.getElementById("theory-view").classList.remove("hidden");

    document.getElementById("lives-container").classList.add("hidden");
    document.getElementById("time-container").classList.add("hidden");

    // disable all control buttons on start
    const gameControlButtons = document.querySelectorAll("#game-control-buttons-container button");
    gameControlButtons.forEach(button => {
        button.classList.add("disabled");
    })
}

// Gamemanager used to call gameover in a more generalised way, setting the game mode in each games
export const gameManager = {
    currentGame: null,

    setGame(gameMethods) {
        this.currentGame = gameMethods
    },

    gameOver() {
        if (this.currentGame && this.currentGame.gameOver) {
            this.currentGame.gameOver()
        }
        else {
            console.log("Game manager is broken")
        }
    }
}

// Custom parse function for values and numbers
export function parseValue(value) {
    if (getGameMode() == "numbers") {
        return parseInt(value);
    } else {
        return value;
    }
}