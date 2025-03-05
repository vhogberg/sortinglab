/* Viktor Högberg, Léo Tuomenoksa Texier */
import { getCorrectMoves, getIncorrectMoves, increaseCorrectMoves, increaseIncorrectMoves, isScoreGood, resetScore } from "./points.js";

const startButton = document.getElementById("start-button");
const swapButton = document.getElementById("swap-button");
const skipButton = document.getElementById("skip-button");
const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
swapButton.classList.add("disabled");
skipButton.classList.add("disabled");

let moveExplanationText = document.getElementById("move-explanation");

// Initial sorted list of all elements
let elementList = document.querySelectorAll(".game-element");

// Global variables of the current two elements selected
let element1;
let element2;

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

function startGame() {
    swapButton.classList.remove("disabled");
    skipButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");
    scrambleElements();
    gameLoop();
}

// async loop so that it waits for button presses
async function gameLoop() {
    while (true) {
        // for loop, using list length -1
        for (let index = 0; index < elementList.length - 1; index++) {
            // grab current indexed element and the one to the right of it
            element1 = elementList[index];
            element2 = elementList[index + 1];

            // add visualisation for selected elements
            element1.classList.add("game-element-highlighted");
            element2.classList.add("game-element-highlighted");

            // wait for button press
            await waitForButtonPress();

            // remove visualisation for selected elements after button press
            element1.classList.remove("game-element-highlighted");
            element2.classList.remove("game-element-highlighted");
        }
    }
}

// Function that stops the for loop, waiting for a button press
async function waitForButtonPress() {
    return new Promise(resolve => {

        function handleClick(event) {
            skipButton.removeEventListener("click", handleClick);
            swapButton.removeEventListener("click", handleClick);
            resolve(event.target.id);
        }

        // Swap or skip
        swapButton.addEventListener("click", swapElements);
        skipButton.addEventListener("click", skip);

        skipButton.addEventListener("click", handleClick);
        swapButton.addEventListener("click", handleClick);

    })
}

//swaps the two marked elements
function swapElements() {

    let element1Value = parseInt(element1.textContent);
    let element2Value = parseInt(element2.textContent);

    if (element1Value > element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is bigger than " + element2Value + " so they should be swapped!";
        increaseCorrectMoves();
    } else if (element1Value === element2Value) {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is equal to " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is smaller than " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
    }

    //gets the parentElement of the first element, ie the game-element-container that contains all elements
    let parentElement = element1.parentElement;

    //moves element2 to be before element1, ie swapping them
    parentElement.insertBefore(element2, element1);

    //since the index of the elements gets shuffled around by swapping them, we reasign all elements to the nodeList to ensure they are in the correct order.
    elementList = document.querySelectorAll(".game-element");
}

// skip function
function skip() {

    let element1Value = parseInt(element1.textContent);
    let element2Value = parseInt(element2.textContent);

    // check if move is correct (i.e whether user should've skipped)
    if (element1Value < element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is smaller than " + element2Value + " so they should not be swapped!";
        increaseCorrectMoves();
    } else if (element1Value === element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is equal to " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is bigger than " + element2Value + " so they should be swapped!";
        increaseIncorrectMoves();
    }
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    elementList = document.querySelectorAll(".game-element");

    // Made a new array containing the values (numbers or letters)
    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        valueArray[index] = elementList[index].textContent;
    }

    // For number-mode
    const isSorted = valueArray.every((value, index, array) =>
        index === 0 || value >= array[index - 1]);

    if (isSorted) {
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
    swapButton.classList.add("disabled");
    skipButton.classList.add("disabled");
    submitButton.classList.add("disabled");

    // reset score for next round;
    resetScore();

    // reset the indexes in list
    elementList = document.querySelectorAll(".game-element");

    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
    }
    //TODO() index+1?
}