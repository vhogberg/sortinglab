/* Viktor Högberg, Léo Tuomenoksa Texier */
import { isSorted } from "./game.js";
import { getCorrectMoves, getIncorrectMoves, increaseCorrectMoves, increaseIncorrectMoves, isScoreGood, resetScore } from "./points.js";

const startButton = document.getElementById("start-button");
const leftButton = document.getElementById("left-button");
const skipButton = document.getElementById("skip-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");

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

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

function startGame() {
    leftButton.classList.remove("disabled");
    skipButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");

    scrambleElements();
    gameLoop();
}

let allowedMoveMade = false;

async function gameLoop() {
    let index = 0;
    while (index < elementList.length) {

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

        leftButton.removeEventListener("click", swapElements);
        skipButton.removeEventListener("click", skip);

        selectedElement.classList.remove("game-element-highlighted");
        index++;
    }
    moveExplanationText.textContent = "No further elements to sort, click submit!";
}

function waitForValidMove() {
    return new Promise(resolve => {
        function checkValidMove() {
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
        allowedMoveMade = false;
        return;
    }
    else if (selectedValue > element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is bigger than " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
        allowedMoveMade = false;
        return;
    }
    else if (selectedValue === element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is equal to " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
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

// Function called if user clicks submit and the array is sorted
function gameOver() {
    if (isScoreGood()) {
        // good score
        alert("Congrats!\nCorrect moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves());
    } else {
        // not good score
        alert("Game over!\nCorrect moves: " + getCorrectMoves() + "\nWrong moves: " + getIncorrectMoves() + "\nTry again to improve your result!");
    }
    // enable startButton again for new round
    startButton.classList.remove("hidden");
    theoryView.classList.remove("hidden");
    leftButton.classList.add("disabled");
    skipButton.classList.add("disabled");
    submitButton.classList.add("disabled");

    // reset the indexes in list
    selectedElement = undefined;
    element2 = undefined;
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