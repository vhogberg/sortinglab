/* Viktor Högberg, Léo Tuomenoksa Texier */
import { getDifficulty, getGameMode, handleGameOptions } from "../game-options.js";
import { gameManager, isSorted, showGameOverDialog } from "../game.js";


const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const gameElementList = document.getElementById("game-element-list");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

let moveExplanationText = document.getElementById("move-explanation");

submitButton.classList.add("disabled");

// By default, show 10 elements
const elementsToHide = document.querySelectorAll(".game-element-hard");
elementsToHide.forEach(elementsToHide => {
    elementsToHide.classList.add("hidden");
});

// Initial sorted list of all elements
let elementList;

let isGameOver = false;


// Function to start the game, hides theory and starts the loop.
function startGame() {

    gameManager.setGame(
        {
            gameOver: function () {
                forceValidMove();
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
}

function enableButtons() {
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");
}

function hideTheory() {
    theoryView.classList.add("hidden");
    document.getElementById("game-difficulty-container").classList.add("hidden");
    document.getElementById("game-mode-container").classList.add("hidden");
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
            element.innerHTML = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
        }
    }
    else if (getGameMode() === "letters") {
        for (const element of elementList) {
            let letterIndex = Math.floor(Math.random() * 26);
            element.innerHTML = String.fromCharCode(uppercaseAsciiStart + letterIndex);
        }
    }
}
var dragging = null;

gameElementList.addEventListener("dragstart", (event) => {
    dragging = event.target.closest("li"); // just grab li's
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData('text/plain', ""); // Needed for Firefox to allow dragging

})

gameElementList.addEventListener("dragover", (event) => {
    event.preventDefault();
    var target = event.target.closest("li"); // just grab li's
    if (!target || target === dragging) return; // return if target does not exist or target is target (dont drop on itself)
    const bounding = target.getBoundingClientRect();
    const offset = event.clientX - bounding.left;

    if (offset > bounding.width / 2) {
        target.parentNode.insertBefore(dragging, target.nextSibling);
    } else {
        target.parentNode.insertBefore(dragging, target);
    }
})

gameElementList.addEventListener("drop", (event) => {
    event.preventDefault();
});

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    getElementsByDifficulty();

    if (isSorted(elementList)) {
        gameOver();
    }
    else {
        moveExplanationText.textContent = "The elements are not sorted correctly yet!"
    }
}

// Function called if user clicks submit and the array is sorted
function gameOver() {

    isGameOver = true;
    showGameOverDialog();

    moveExplanationText.textContent = "";

    elementList = null;
}