/* Viktor Högberg, Léo Tuomenoksa Texier */
import { getDifficulty, getGameMode, handleGameOptions, isLivesEnabled } from "../game-options.js";
import { gameManager, isSorted, parseValue, showGameOverDialog } from "../game.js";
import { getIncorrectMoves, increaseCorrectMoves, increaseIncorrectMoves, resetScore } from "../points.js";

const startButton = document.getElementById("start-button");
const swapButton = document.getElementById("swap-button");
const skipButton = document.getElementById("skip-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const aboutAlgorithmContainer = document.getElementById("about-algorithm-container");  // TODO fix from options container to this for other algorithms

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
swapButton.classList.add("disabled");
skipButton.classList.add("disabled");

let moveExplanationText = document.getElementById("move-explanation");

// Initial sorted list of all elements
let elementList;

// Global variables of the current two elements selected
let element1;
let element2;

// By default, show 10 elements
const elementsToHide = document.querySelectorAll(".game-element-hard");
elementsToHide.forEach(elementsToHide => {
    elementsToHide.classList.add("hidden");
});

function startGame() {

    gameManager.setGame(
        {
            gameOver: function () {
                isGameOver = true;
                gameOver();
            }
        })

    isGameOver = false;
    handleGameOptions();
    enableButtons();
    hideTheory();
    getElementsByDifficulty();
    scrambleElements();
    gameLoop();
}

function enableButtons() {
    swapButton.classList.remove("disabled");
    skipButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
}

function hideTheory() {
    theoryView.classList.add("hidden");
    aboutAlgorithmContainer.classList.add("hidden");
}

//gets elements according to the difficulty setting, by checking only importing elements associated with checked difficulty
function getElementsByDifficulty() {

    console.log("difficulty: " + getDifficulty())
    elementList = [];

    //uses getDifficulty from game-options.js to obtain checked difficulty 
    if (getDifficulty() == "easy") {
        elementList = document.querySelectorAll(".game-element-easy");
    } else if (getDifficulty() == "normal") {
        elementList = document.querySelectorAll(".game-element-easy, .game-element-normal");
    } else if (getDifficulty() == "hard") {
        elementList = document.querySelectorAll(".game-element-easy, .game-element-normal, .game-element-hard");
    }
}

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    // for letter mode, the ASCII values for uppercase letters range from 65 to 90
    const uppercaseAsciiStart = 65;
    if (getGameMode() === "numbers") {
        for (const element of elementList) {
            element.textContent = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
        }
    }
    else if (getGameMode() === "letters") {
        for (const element of elementList) {
            let letterIndex = Math.floor(Math.random() * 26);
            element.textContent = String.fromCharCode(uppercaseAsciiStart + letterIndex);
        }
    }
}

let isGameOver = false;

// async loop so that it waits for button presses
async function gameLoop() {
    while (!isGameOver) {
        // for loop, using list length -1
        for (let index = 0; index < elementList.length - 1; index++) {
            // grab current indexed element and the one to the right of it
            element1 = elementList[index];
            element2 = elementList[index + 1];

            // add visualisation for selected elements
            if (!isGameOver) {
                element1.classList.add("game-element-highlighted");
                element2.classList.add("game-element-highlighted");
            }

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

    let element1Value = parseValue(element1.textContent);
    let element2Value = parseValue(element2.textContent);

    if (element1Value > element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is bigger than " + element2Value + " so they should be swapped!";
        increaseCorrectMoves();
    } else if (element1Value === element2Value) {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is equal to " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
        checkLives();
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is smaller than " + element2Value + " so they should not be swapped!";
        increaseIncorrectMoves();
        checkLives();
    }

    //gets the parentElement of the first element, ie the game-element-container that contains all elements
    let parentElement = element1.parentElement;

    //moves element2 to be before element1, ie swapping them
    parentElement.insertBefore(element2, element1);

    //since the index of the elements gets shuffled around by swapping them, we reassign all elements to the nodeList to ensure they are in the correct order.
    getElementsByDifficulty();
}

// skip function
function skip() {

    let element1Value = parseValue(element1.textContent);
    let element2Value = parseValue(element2.textContent);

    // check if move is correct (i.e whether user should've skipped)
    if (element1Value < element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is smaller than " + element2Value + " so they should not be swapped!";
        increaseCorrectMoves();
    } else if (element1Value === element2Value) {
        moveExplanationText.textContent = "Correct! " + element1Value + " is equal to " + element2Value + " so they should not be swapped!";
        increaseCorrectMoves();
        checkLives();
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1Value + " is bigger than " + element2Value + " so they should be swapped!";
        increaseIncorrectMoves();
        checkLives();
    }
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    if (isSorted(elementList)) {
        gameOver()
    }
    else {
        alert("Not sorted yet, continue!"); //when implementing own alert, pause timer if user clicks submit too early
    }
}

// Method that ends the game if user is playing with lives and is out of lives
function checkLives() {
    if (isLivesEnabled() && getIncorrectMoves() === 3) {
        isGameOver = true;
        gameOver();
    }
}


// Function called if user clicks submit and the array is sorted
function gameOver() {
    isGameOver = true;

    showGameOverDialog();

    // reset score for next round;
    resetScore();

    moveExplanationText.textContent = "";

    // reset the indexes in list
    getElementsByDifficulty();

    // remove highlighted class after game is over and reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
    }
}