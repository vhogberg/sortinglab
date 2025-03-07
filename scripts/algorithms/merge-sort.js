/* Viktor Högberg, Léo Tuomenoksa Texier */
import { handleGameOptions, isLivesEnabled } from "../game-options.js";
import { gameManager, isSorted, showGameOverDialog } from "../game.js";
import { getIncorrectMoves, increaseCorrectMoves, increaseIncorrectMoves, resetScore } from "../points.js";

const startButton = document.getElementById("start-button");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const optionsContainer = document.getElementById("game-options-container");
const difficultyContainer = document.getElementById("game-difficulty-container");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
leftButton.classList.add("disabled");
rightButton.classList.add("disabled");

// Game difficulty is not an option on merge sort since it can only be visualised here with 8 elements
difficultyContainer.classList.add("hidden");

let moveExplanationText = document.getElementById("move-explanation");

// Initial sorted list of all elements
let elementList;

// Global variables of elements to be moved
let leftElement;
let rightElement;
let leftElements = [];
let rightElements = [];
let nextRowElements;

// Global looping elements
let elementIndex = 0;
let rowIndex = 1;
let currentSubArray;
let subArrayIndex;

// 2D array of elements
let rowArray;

let allowedMoveMade = false;
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
    scrambleElements();
    gameLoop();
}

function enableButtons() {
    leftButton.classList.remove("disabled");
    rightButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
}

function hideTheory() {
    theoryView.classList.add("hidden");
    optionsContainer.classList.add("hidden");
}


// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element-row-1");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 11); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

// Game loop
async function gameLoop() {
    //ensures that rowIndex is 1 after game has been "cancelled" when user runs out of lives/time
    rowIndex = 1;

    while (rowIndex < 4) {

        if (isGameOver) {
            return;
        }

        // Insert elements into 2d array, different depending on current row.
        if (rowIndex === 1) {
            rowArray = [
                [elementList[elementIndex], elementList[elementIndex + 1]],
                [elementList[elementIndex + 2], elementList[elementIndex + 3]],
                [elementList[elementIndex + 4], elementList[elementIndex + 5]],
                [elementList[elementIndex + 6], elementList[elementIndex + 7]],
            ]
        }
        else if (rowIndex === 2) {
            rowArray = [
                [elementList[elementIndex], elementList[elementIndex + 1], elementList[elementIndex + 2], elementList[elementIndex + 3]],
                [elementList[elementIndex + 4], elementList[elementIndex + 5], elementList[elementIndex + 6], elementList[elementIndex + 7]]
            ]
            if (!isGameOver) {
                getElementsRow2();
            }

        }
        else if (rowIndex === 3) {
            rowArray = [
                [elementList[elementIndex], elementList[elementIndex + 1], elementList[elementIndex + 2], elementList[elementIndex + 3],
                elementList[elementIndex + 4], elementList[elementIndex + 5], elementList[elementIndex + 6], elementList[elementIndex + 7]]
            ]
            if (!isGameOver) {
                getElementsRow3();
            }
        }
        // Inner loop that goes through the 8 elements
        while (elementList !== null && elementIndex < 8) {
            allowedMoveMade = false;

            
            addMarkingForNextRow();
            //adds marking to left/right elements of first row, since the row is eight elements long marked-left will always be on even element
            if (rowIndex === 1) {
                //if elementIndex is even it means left are on even element, so add left to current element and right to element after
                if (elementIndex % 2 === 0) {
                    //uses parentElement since we are putting the colors on container around the element, not the element itself
                    elementList[elementIndex].parentElement.classList.add("marked-left");
                    elementList[elementIndex + 1].parentElement.classList.add("marked-right");

                }
                //if elementIndex is uneven it means left are on uneven element, so add marked-left to element before and right to current after
                else {
                    elementList[elementIndex - 1].parentElement.classList.add("marked-left");
                    elementList[elementIndex].parentElement.classList.add("marked-right");
                }
            }

            //sets index for subarray depending on current row and elementIndex
            if (rowIndex === 1) {
                //divided by two since elementIndex goes up to eight while there are four subarrays for row 1
                subArrayIndex = Math.floor(elementIndex / 2)
            }
            else if (rowIndex === 2) {
                subArrayIndex = Math.floor(elementIndex / 4);
            }
            else if (rowIndex === 3) {
                subArrayIndex = 0;
            }

            // for getting values in the second set of subarrays in row 2 only.
            if (rowIndex === 2 && elementIndex === 4) {
                removeMarking(2);
                removeMarkingForNextRow(3);
                if (!isGameOver) {
                    getElementsRow2();
                }
            }

            leftButton.addEventListener("click", handleLeftClick);
            rightButton.addEventListener("click", handleRightClick);
            await waitForValidMove();

            //removes markings from nextRow
            if (rowIndex === 1) {
                removeMarkingForNextRow(2);
                leftElement.parentElement.classList.remove("marked-left");
                rightElement.parentElement.classList.remove("marked-right");
            }

            leftButton.removeEventListener("click", handleLeftClick);
            rightButton.removeEventListener("click", handleRightClick);
        }
        // Increment outer loop and reset some global variables
        rowIndex++;
        elementIndex = 0;
        elementList = document.querySelectorAll(`.game-element-row-${rowIndex}`);
        rowArray = [];
        currentSubArray = [];
        subArrayIndex = 0;
        leftElements = [];
        rightElements = [];

    }
    // Loop is done, user shall click submit!
    moveExplanationText.textContent = "No further elements to sort, click submit!";
    removeMarking(3);
    removeMarkingForNextRow(4);
    isGameOver = true; //replaced gameIsOver
}



// Handles for buttons
function handleLeftClick() {
    handleMove("left");
}

function handleRightClick() {
    handleMove("right");
}

// Function that stops the loop, waiting for a button press
// Can also be called with forceValidMove();
let checkValidMove;
function waitForValidMove() {
    return new Promise(resolve => {
        checkValidMove = function () {
            if (allowedMoveMade) {
                elementIndex++;
                resolve();
                removeEventListeners();
            }
        }

        function removeEventListeners() {
            rightButton.removeEventListener("click", checkValidMove);
            leftButton.removeEventListener("click", checkValidMove);
        }

        rightButton.addEventListener("click", checkValidMove);
        leftButton.addEventListener("click", checkValidMove);
    })
}

// Forces a valid move, so that the wait method can be resolved with resolve()
function forceValidMove() {
    allowedMoveMade = true;
    checkValidMove();
}

// Function to get right and left arrays of elements for row 2
function getElementsRow2() {
    currentSubArray = rowArray[subArrayIndex];
    if (elementIndex < 4) {
        leftElements.push(currentSubArray[0]);
        leftElements.push(currentSubArray[1]);
        rightElements.push(currentSubArray[2]);
        rightElements.push(currentSubArray[3]);
        addMarking();

    }
    else {
        leftElements = [];
        rightElements = [];
        leftElements.push(currentSubArray[0]);
        leftElements.push(currentSubArray[1]);
        rightElements.push(currentSubArray[2]);
        rightElements.push(currentSubArray[3]);
        addMarking();
        addMarkingForNextRow();
    }
}

// Function to get right and left arrays of elements for row 3
function getElementsRow3() {
    removeMarking(2);
    removeMarkingForNextRow(3);
    currentSubArray = rowArray[subArrayIndex];

    for (let subIndex = 0; subIndex < currentSubArray.length; subIndex++) {
        if (subIndex < 4) {
            leftElements.push(currentSubArray[subIndex]);
        }
        else {
            rightElements.push(currentSubArray[subIndex]);
        }
    }
    addMarking();
}
// function that adds the left/right visualisation to a set of elements
function addMarking() {
    for (const element of leftElements) {
        element.parentElement.classList.add("marked-left");
    }
    for (const element of rightElements) {
        element.parentElement.classList.add("marked-right");
    }
}

// function that removes the left/right visualisation for a certain given row from a parameter
function removeMarking(index) {
    const list = document.querySelectorAll(`.game-element-row-${index}`);
    for (let index = 0; index < list.length; index++) {
        list[index].parentElement.classList.remove("marked-left");
        list[index].parentElement.classList.remove("marked-right");
    }
}

function addMarkingForNextRow() {
    //gets next row, one above current rowIndex
    nextRowElements = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
    nextRowElements[elementIndex].parentElement.classList.add("next-row-marked");
}

function removeMarkingForNextRow(index) {
    const list = document.querySelectorAll(`.game-element-row-${index}`);
    for (let index = 0; index < list.length; index++) {
        list[index].parentElement.classList.remove("next-row-marked");
    }
}

// Function to get the value of a certain element
function getValue(elementToGetValue) {
    return parseInt(elementToGetValue.textContent);
}

// Function to get the smallest value of an array of elements
function getSmallestValue(rowArray) {
    let allValues = rowArray.flat(Infinity).map(div => getValue(div));
    return Math.min(...allValues);
}

// Function that handles a move, takes in a direction "left" or "right" and calls the move method.
function handleMove(direction) {

    // FOR ROW 1
    if (rowIndex === 1) {
        if (elementIndex % 2 === 0) {
            leftElement = elementList[elementIndex];
            rightElement = elementList[elementIndex + 1];
        }
        else {
            leftElement = elementList[elementIndex - 1];
            rightElement = elementList[elementIndex];
        }

        if (direction == "left") {
            moveDownElement(leftElement);
        } else if (direction == "right") {
            moveDownElement(rightElement);
        }
    }
    // FOR ROW 2 and 3
    else if (rowIndex === 2 || 3) {
        if (direction == "left") {
            //sorts elements to ensure the smallest value is available at index 0
            leftElements.sort();
            leftElement = leftElements[0];
            moveDownElement(leftElement);
        } else if (direction == "right") {
            rightElements.sort();
            rightElement = rightElements[0];
            moveDownElement(rightElement);
        }
    }
}

// Function that moves an element to its place on the row below (has error checks)
function moveDownElement(elementToMove) {

    // If it does not exist, do nothing.
    if (elementToMove == undefined) {
        return;
    }
    // If it is not the smallest element in the current subarray, do nothing.
    if (getValue(elementToMove) !== getSmallestValue(rowArray[subArrayIndex])) {
        console.log("incorrect move move down element")
        moveExplanationText.textContent = "Wrong! There is a smaller element on the other side!"
        increaseIncorrectMoves();
        checkLives();
        return;
    } else {

        // FOR ROW 1, remove from top level rowArray
        const indexOfMovedElement = rowArray[subArrayIndex].indexOf(elementToMove);

        if (rowIndex === 1) {
            if (indexOfMovedElement > -1) { // only splice array if an element is found
                rowArray[subArrayIndex].splice(indexOfMovedElement, 1); //  remove one item only
                elementToMove.parentElement.classList.add("marked-disabled");
            }
        }
        // FOR ROW 2 and 3, remove from inner level arrays (left and right arrays)
        else if (rowIndex === 2 || 3) {
            if (indexOfMovedElement > -1) { // only splice array if an element is found
                rowArray[subArrayIndex].splice(indexOfMovedElement, 1); //  remove one item only
            }
            if (leftElements.includes(elementToMove)) {
                const indexOfMovedLeftElement = leftElements.indexOf(elementToMove);
                leftElements.splice(indexOfMovedLeftElement, 1);
                if (leftElements.length === 0) {
                    elementToMove.parentElement.classList.add("marked-disabled");
                }
            }
            else if (rightElements.includes(elementToMove)) {
                const indexOfMovedRightElement = rightElements.indexOf(elementToMove);
                rightElements.splice(indexOfMovedRightElement, 1);
                if (rightElements.length === 0) {
                    elementToMove.parentElement.classList.add("marked-disabled");
                }
            }
        }

        nextRowElements = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
        nextRowElements[elementIndex].textContent = parseInt(elementToMove.textContent);
    }
    // give points
    increaseCorrectMoves();
    allowedMoveMade = true;
    moveExplanationText.textContent = ""
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {

    if (!isGameOver) {
        alert("Not sorted yet 1, continue!"); // when implementing own alert, pause timer if user clicks submit too early
        return;
    }

    const elementList = document.querySelectorAll(".game-element-row-4");

    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        valueArray[index] = elementList[index].textContent;
    }

    let listHasEmptyElements = false;
    for (let index = 0; index < valueArray.length; index++) {
        if (valueArray[index] === "") {
            listHasEmptyElements = true;
        }
    }
    if (listHasEmptyElements) {
        alert("Not sorted yet 2, continue!");
        return;
    }

    if (isSorted(elementList)) {
        gameOver();
    }
    else {
        alert("Not sorted yet 3, continue!");
    }
}

// Method that ends the game if user is playing with lives and is out of lives
function checkLives() {
    console.log("merge sort all lives lost " + getIncorrectMoves());
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
    leftElement = undefined;
    rightElement = undefined;

    // Reset points for next round
    resetScore();

    moveExplanationText.textContent = "";

    rowIndex = 1; //TODO check which are necessary
    rowArray = [];
    currentSubArray = [];
    subArrayIndex = 0;
    leftElements = [];
    rightElements = [];

    const allElements = document.querySelectorAll(".game-element");
    for (let index = 0; index < allElements.length; index++) {
        allElements[index].parentElement.classList.remove("marked-disabled");
        allElements[index].parentElement.classList.remove("marked-left");
        allElements[index].parentElement.classList.remove("marked-right");
        allElements[index].parentElement.classList.remove("next-row-marked");
        allElements[index].innerHTML = "";
    }
    elementList = null;
}