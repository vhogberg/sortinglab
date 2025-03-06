/* Viktor Högberg, Léo Tuomenoksa Texier */

import { isLivesEnabled, resetLives } from "./game-options.js";
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
    //check for if user has enabled lives and lost them all
    if (isLivesEnabled() && getIncorrectMoves() === 3) {
        document.getElementById("game-over-title").textContent = "All lives lost\n!💔💔💔";
        document.getElementById("game-over-text").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves();
    }
    else {
        if (isScoreGood()) {
            // good score
            document.getElementById("game-over-title").textContent = "Congrats!";
            document.getElementById("game-over-text").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves();
        } else {
            // not good score
            document.getElementById("game-over-title").textContent = "Game over!";
            document.getElementById("game-over-text").textContent = "Correct moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves() + "\nTry again to improve your result!";
        }
    }
    gameOverDialog.showModal();
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

    // disable all control buttons on start
    const gameControlButtons = document.querySelectorAll("#game-control-buttons-container button");
    gameControlButtons.forEach(button => {
        button.classList.add("disabled");
    })
}