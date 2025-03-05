/* Viktor Högberg, Léo Tuomenoksa Texier */

const startButton = document.getElementById("start-button");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
leftButton.classList.add("disabled");
rightButton.classList.add("disabled");

let moveExplanationText = document.getElementById("move-explanation");

// Initial sorted list of all elements
let elementList;

// Global variables of elements to be moved
let leftElement;
let rightElement;
let leftElements = [];
let rightElements = [];
let nextRowElements;

// Points
let correctMoves = 0;
let wrongMoves = 0;
let allowedMoveMade = false;

// Global looping elements
let elementIndex = 0;
let rowIndex = 1;
let currentSubArray;
let subArrayIndex;

// 2D array of elements
let rowArray;

// Function to start game, when click on "start" button this is run.
function startGame() {
    leftButton.classList.remove("disabled");
    rightButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");

    scrambleElements();
    gameLoop();
}

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element-row-1");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 10); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

// Game loop
async function gameLoop() {
    while (rowIndex < 4) {

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
            getElementsRow2();
        }
        else if (rowIndex === 3) {
            rowArray = [
                [elementList[elementIndex], elementList[elementIndex + 1], elementList[elementIndex + 2], elementList[elementIndex + 3],
                elementList[elementIndex + 4], elementList[elementIndex + 5], elementList[elementIndex + 6], elementList[elementIndex + 7]]
            ]
            getElementsRow3();
        }
        // Inner loop that goes through the 8 elements
        while (elementIndex < 8) {
            allowedMoveMade = false;


            // TODO() disabled look too.
            if (rowIndex === 1) {
                if (elementIndex % 2 === 0) {
                    elementList[elementIndex].parentElement.classList.add("marked-left");
                    elementList[elementIndex + 1].parentElement.classList.add("marked-right");

                }
                else {
                    elementList[elementIndex - 1].parentElement.classList.add("marked-left");
                    elementList[elementIndex].parentElement.classList.add("marked-right");
                }
            }

            if (rowIndex === 1) {
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
                getElementsRow2();
            }

            leftButton.addEventListener("click", handleLeftClick);
            rightButton.addEventListener("click", handleRightClick);
            await waitForValidMove();

            if (rowIndex === 1) {
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
    gameIsOver = true;
}

let gameIsOver = false;

// Handles for buttons
function handleLeftClick() {
    console.log("left button clicked");
    handleMove("left");
}

function handleRightClick() {
    console.log("right button clicked");
    handleMove("right");
}

// await function for a correct move that continues the game loop
function waitForValidMove() {
    return new Promise(resolve => {
        function checkValidMove() {
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

// Function to get right and left arrays of elements for row 2
function getElementsRow2() {
    console.log("SubArrayIndex Row 2: " + subArrayIndex);
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
    }
}

function addMarking () {
    for (const element of leftElements) {
        element.parentElement.classList.add("marked-left");
    }
    for (const element of rightElements) {
        element.parentElement.classList.add("marked-right");
    }
}

function removeMarking (index) {
    const list = document.querySelectorAll(`.game-element-row-${index}`);
    for (let index = 0; index < list.length; index++) {
        list[index].parentElement.classList.remove("marked-left");
        list[index].parentElement.classList.remove("marked-right");
    }
}

// Function to get right and left arrays of elements for row 3
function getElementsRow3() {
    removeMarking(2);

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

// Function to get the value of a certain element
function getValue(elementToGetValue) {
    console.log("GetValueOfAnElement: " + parseInt(elementToGetValue.textContent));
    return parseInt(elementToGetValue.textContent);
}

// Function to get the smallest value of an array of elements
function getSmallestValue(rowArray) {
    let allValues = rowArray.flat(Infinity).map(div => getValue(div));
    console.log("Smallest value. ArrayName: " + rowArray + " value: " + Math.min(...allValues));
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
        /*
        // for getting values in the second set of subarrays in row 2 only.
        if (rowIndex === 2 && elementIndex === 4) {

                getElementsRow2();

        }
            */
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
    console.log("TOMOVE: " + elementToMove.textContent);
    // If it is not the smallest element in the current subarray, do nothing.
    if (getValue(elementToMove) !== getSmallestValue(rowArray[subArrayIndex])) {
        console.log("SMALLEST ELEMENT: " + getSmallestValue(rowArray[subArrayIndex]));
        moveExplanationText.textContent = "Wrong! There is a smaller element on the other side!"
        wrongMoves++;
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
                    elementToMove.parentElement.classList.add("marked-disabled"); //TODO
                }
            }
            else if (rightElements.includes(elementToMove)) {
                const indexOfMovedRightElement = rightElements.indexOf(elementToMove);
                rightElements.splice(indexOfMovedRightElement, 1);
                if (rightElements.length === 0) {
                    elementToMove.parentElement.classList.add("marked-disabled"); //TODO
                }
            }
        }

        nextRowElements = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
        nextRowElements[elementIndex].textContent = parseInt(elementToMove.textContent);
    }
    // give points
    correctMoves++;
    allowedMoveMade = true;
    moveExplanationText.textContent = ""
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {

    if (!gameIsOver) {
        alert("Not sorted yet, continue!");
        return;
    }

    elementList = document.querySelectorAll(".game-element-row-4");

    // Made a new array containing the values (numbers or letters)
    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        valueArray[index] = elementList[index].textContent;
    }

    let listIsSorted = false;
    for (let index = 0; index < valueArray.length; index++) {
        if (valueArray[index] === "") {
            listIsSorted = true;
        }
    }
    if (listIsSorted) {
        alert("Not sorted yet, continue!");
        return;
    }

    // For number-mode
    const isSorted = valueArray.every((value, index, array) =>
        index === 0 || value >= array[index - 1]);

    if (isSorted) {
        gameOver();
    }
    else {
        alert("Not sorted yet, continue!");
    }
}

// Function called if user clicks submit and the array is sorted
function gameOver() {
    if (wrongMoves > correctMoves * 0.4) {
        alert("Game over!\nCorrect moves: " + correctMoves + "\nWrong moves: " + wrongMoves + "\nTry again to improve your result!");
    } else {
        alert("Congrats!\nCorrect moves: " + correctMoves + "\nWrong moves: " + wrongMoves);
    }
    // enable startButton again for new round
    startButton.classList.remove("hidden");
    theoryView.classList.remove("hidden");
    leftButton.classList.add("disabled");
    rightButton.classList.add("disabled");
    submitButton.classList.add("disabled");

    // reset the indexes in list
    leftElement = undefined;
    rightElement = undefined;
    // Reset points for next round
    wrongMoves = 0;
    correctMoves = 0;

    moveExplanationText.textContent = "";

    rowIndex = 1;
    rowArray = [];
    currentSubArray = [];
    subArrayIndex = 0;
    leftElements = [];
    rightElements = [];

    const allElements = document.querySelectorAll(".game-element");
    for (let index = 0; index < allElements.length; index++) {
        allElements[index].parentElement.classList.remove("marked-disabled");
        allElements[index].innerHTML = "";
    }

    // reset ordering on theoryview
    elementList = document.querySelectorAll(".game-element-row-1");
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index + 1;
    }

    elementList = null;
}