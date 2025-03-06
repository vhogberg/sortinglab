/* Viktor Högberg, Léo Tuomenoksa Texier */
import { handleGameOptions, isLivesEnabled } from "../game-options.js";
import { isSorted, showGameOverDialog } from "../game.js";
import { getIncorrectMoves, increaseCorrectMoves, increaseIncorrectMoves, resetScore } from "../points.js";

const startButton = document.getElementById("start-button");
const leftButton = document.getElementById("left-button");
const skipButton = document.getElementById("skip-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const optionsContainer = document.getElementById("game-options-container");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
leftButton.classList.add("disabled");
skipButton.classList.add("disabled");

let moveExplanationText = document.getElementById("move-explanation");

// Initial sorted list of all elements
let elementList;

// Global variables of the current two elements
let selectedElement;
let element2;

let allowedMoveMade = false;
let isGameOver = false;

function startGame() {
    isGameOver = false;
    handleGameOptions();
    disableButtons();
    hideTheory();
    scrambleElements();
    gameLoop();
}

function disableButtons() { //maybe rename
    leftButton.classList.remove("disabled");
    skipButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
}

function hideTheory() {
    theoryView.classList.add("hidden");
    optionsContainer.classList.add("hidden");
}

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

let index = 0;

async function gameLoop() {
    // If element list is null, stop the loop
    // This first check cancels out the second check, so null.length is never considered.
    while (elementList !== null && index < elementList.length) { 
        selectedElement = elementList[index];

        if (index != 0) {
            element2 = elementList[index - 1];
        }
        // add eventlistener to left (swap) button here, button can be pressed multiple times until listener is removed
        leftButton.addEventListener("click", swapElements);
        // add visualisation for selected element
        selectedElement.classList.add("game-element-highlighted");

        skipButton.addEventListener("click", skip);

        await waitForValidMove();

        if (!isGameOver) {
            leftButton.removeEventListener("click", swapElements);
            skipButton.removeEventListener("click", skip);

            selectedElement.classList.remove("game-element-highlighted");
            index++;
        }
    }
    moveExplanationText.textContent = "No further elements to sort, click submit!";
}

// Function that stops the loop, waiting for a button press
// Can also be called with forceValidMove();
let checkValidMove;
function waitForValidMove() {
    return new Promise(resolve => {
        checkValidMove = function () {
            if (allowedMoveMade) {
                resolve();
                removeEventListeners();
            }
        }

        function removeEventListeners() {
            leftButton.removeEventListener("click", checkValidMove);
            skipButton.removeEventListener("click", checkValidMove);
        }

        leftButton.addEventListener("click", checkValidMove);
        skipButton.addEventListener("click", checkValidMove)
    })
}

// Forces a valid move, so that the wait method can be resolved with resolve()
function forceValidMove() {
    allowedMoveMade = true;
    checkValidMove();
}

function skip() {
    let selectedValue = parseInt(selectedElement.textContent);
    let element2Value = element2 ? parseInt(element2.textContent) : undefined;

    // Ensure the element list is updated after possible swaps
    elementList = document.querySelectorAll(".game-element");

    if (!element2) {
        moveExplanationText.textContent = "Correct! You should always skip when the selected element is furthest to the left!";
        increaseCorrectMoves();
        allowedMoveMade = true;
        return;
    }
    if (selectedValue < element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is smaller than " + element2Value + " so it should be swapped!";
        increaseIncorrectMoves();
        checkLives();
        allowedMoveMade = false;
        return;
    }
    if (selectedValue > element2Value) {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is bigger than " + element2Value + " so it should be skipped!";
        increaseCorrectMoves();
        allowedMoveMade = true;
    } else {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is equal to " + element2Value + " so they should be skipped!";
        increaseCorrectMoves();
        allowedMoveMade = true;
    }
}

// Swaps the SELECTED element with element to the left of selected element
function swapElements() {

    let selectedValue = parseInt(selectedElement.textContent);

    // Check if element2 exists before accessing its textContent
    let element2Value = element2 ? parseInt(element2.textContent) : undefined;

    if (element2 === undefined) {
        moveExplanationText.textContent = "Wrong! You can't move this further to the left!";
        // TODO("Update to selection sort theory");
        increaseIncorrectMoves();
        checkLives();
        allowedMoveMade = false;
        return;
    }
    else if (selectedValue > element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is bigger than " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
        checkLives();
        allowedMoveMade = false;
        return;
    }
    else if (selectedValue === element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is equal to " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
        checkLives();
        allowedMoveMade = false;
        return;
    }
    else {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is smaller than " + element2Value + " so they should be swapped!";
        increaseCorrectMoves();
        allowedMoveMade = true;
    }

    // gets the parentElement of the first element, ie the container that contains all elements
    let parentElement = selectedElement.parentElement;

    //moves SELECTED element to LEFT OF element2, swapping them
    parentElement.insertBefore(selectedElement, element2);

    //since the index of the elements gets shuffled around by swapping them, we reasign all elements to the nodeList to ensure they are in the correct order.
    elementList = document.querySelectorAll(".game-element");

    //convert nodeList to array in order to be able to run indexOf
    let elementArray = Array.from(elementList);

    let selectedElementIndex = elementArray.indexOf(selectedElement);

    //updates the element to the left of selectedElement to the new element present after swap
    element2 = elementList[selectedElementIndex - 1];

    // If element2 is bigger
    if (element2 !== undefined && parseInt(element2.textContent) > parseInt(selectedElement.textContent)) {
        allowedMoveMade = false;
    }
    elementList = document.querySelectorAll(".game-element");
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    if (isSorted("insertion")) {
        gameOver()
    }
    else {
        alert("Not sorted yet, continue!");
    }
}

// Method that ends the game if user is playing with lives and is out of lives
function checkLives() {
    if (isLivesEnabled() && getIncorrectMoves() === 3) {
        forceValidMove();
        isGameOver = true;
        gameOver();
    }
}

// Function called if user clicks submit and the array is sorted
function gameOver() {
    isGameOver = true;
    showGameOverDialog();

    // reset the indexes in list
    selectedElement = undefined;
    element2 = undefined;
    index = 0;
    // Reset points for next round
    resetScore();

    moveExplanationText.textContent = "";

    // remove highlighted class after game is over
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
    }
    // reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index; //TODO() index+1?
    }
    elementList = null;
}