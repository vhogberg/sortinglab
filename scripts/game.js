/* Viktor Högberg, Léo Tuomenoksa Texier */

import { didTimeRunOut, isLivesEnabled, isPointsDisabled, isTimeEnabled, resetCountdown, resetLives } from "./game-options.js";
import { getCorrectMoves, getIncorrectMoves, isScoreGood } from "./points.js";

const gameOverDialog = document.getElementById("game-over-dialog");

// function that checks whether the elements are sorted, either numbers or characters
export function isSorted(algorithmName) {

    let elementList;

    // merge sort needs to only take the fourth row of elements into consideration
    if (algorithmName == "merge") {
        elementList = document.querySelectorAll(".game-element-row-4");
    } else {
        // all others can just grab all game elements
        elementList = document.querySelectorAll(".game-element");
    }

    // new array of the values, instead of elementList which is a nodelist
    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        valueArray[index] = elementList[index].textContent;
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

    // check for if user has enabled lives and lost them all
    if (isTimeEnabled()) {
        resetCountdown();
    }

    // Lives enabled and all 3 lives lost
    if (isLivesEnabled() && getIncorrectMoves() === 3) {
        document.getElementById("game-over-title").textContent = "All lives lost\n!💔💔💔";
        if (!isPointsDisabled()) {
            document.getElementById("game-over-points").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves();
        }
        gameOverDialog.showModal();
        return;
    }

    // Lives enabled and time ran out
    if (isTimeEnabled() && didTimeRunOut()) {
        document.getElementById("game-over-title").textContent = "Time is up!";
        if (!isPointsDisabled) {
            document.getElementById("game-over-points").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves();
        }
        resetCountdown();
        gameOverDialog.showModal();
        return;
    }

    // Game completed without hindarance and score is good!
    if (isScoreGood()) {
        // good score
        document.getElementById("game-over-title").textContent = "Congrats!";
        if (!isPointsDisabled()) {
            document.getElementById("game-over-points").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves();
        }
        gameOverDialog.showModal();
        return;
    } // Game completed without hindarance and score is bad!
    else {
        // not good score
        document.getElementById("game-over-title").textContent = "Game over!";
        if (!isPointsDisabled()) {
            document.getElementById("game-over-points").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves() + "\nTry again to improve your result!";
        }
        gameOverDialog.showModal();
        return;
    }
}

document.getElementById("try-again-button").addEventListener("click", () => {
    gameOverDialog.close();
    handleHidingElements();
    if (isLivesEnabled()) {
        resetLives();
    }
})


document.getElementById("return-home-button").addEventListener("click", () => {
    gameOverDialog.close();
    handleHidingElements();
    if (isLivesEnabled()) {
        resetLives();
    }
    //returns to index.html, ie the 'homescreen'
    window.location.href = "index.html";
})

// show theory view + game options after game is over. disable game control buttons (until game is started)
function handleHidingElements() {
    document.getElementById("game-options-container").classList.remove("hidden");
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


export const gameManager = {
    currentGame: null,

    setGame(gameMethods) {
        this.currentGame = gameMethods
        console.log("gameManagerConstructor");
    },

    gameOver() {
        console.log("current game: " + this.currentGame);
        if (this.currentGame && this.currentGame.gameOver) {
            this.currentGame.gameOver()
        }
        else {
            console.log("trasig")
        }
    }
}