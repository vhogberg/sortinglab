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
let elementList2;

// Global variables of the current two elements
let leftElement;
let rightElement;
let element3;
let element4;
let element5;
let element6;
let element7;
let element8;

let correctMoves = 0;
let wrongMoves = 0;

let allowedMoveMade = false;
let rowDone = false;


// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element-row-1");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 10); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
    // elementList2 = document.querySelectorAll(".game-element-row-2");
}

function startGame() {
    leftButton.classList.remove("disabled");
    rightButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");

    scrambleElements();
    gameLoop();
}

let elementIndex = 0;
let rowIndex = 1;

let rowArray;

function getValue(elementToGetValue) {
    return parseInt(elementToGetValue.textContent);
}

function getSmallestValue(rowArray) {
    let allValues = rowArray.flat(Infinity).map(div => getValue(div));
    return Math.min(...allValues);
}

async function gameLoop() {
    while (rowIndex < 4) {

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
        }
        else if (rowIndex === 3) {
            rowArray = [
                [elementList[elementIndex], elementList[elementIndex + 1], elementList[elementIndex + 2], elementList[elementIndex + 3],
                elementList[elementIndex + 4], elementList[elementIndex + 5], elementList[elementIndex + 6], elementList[elementIndex + 7]]
            ]
        }

        while (elementIndex < 8) {
            console.log("Element index: " + elementIndex)
            allowedMoveMade = false;

            // leftElement.classList.add("marked-left");
            // rightElement.classList.add("marked-right");

            leftButton.addEventListener("click", handleLeftClick);
            rightButton.addEventListener("click", handleRightClick);
            await waitForValidMove();

            // leftElement.classList.remove("marked-left");
            // rightElement.classList.remove("marked-right");
            leftButton.removeEventListener("click", handleLeftClick);
            rightButton.removeEventListener("click", handleRightClick);
        }
        rowIndex++;
        console.log("new for loop, rowindex: " + rowIndex);
        elementIndex = 0;
        elementList = document.querySelectorAll(`.game-element-row-${rowIndex}`);
        rowArray = [];
        currentSubArray = [];
        subArrayIndex = 0;
        leftElements = [];
        rightElements = [];
        // elementList2 = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
    }
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

function handleLeftClick() {
    checkMove("left");
}

function handleRightClick() {
    checkMove("right");
}

let leftElements = [];
let rightElements = [];

let currentSubArray;
let subArrayIndex;

function checkMove(direction) {

    if (rowIndex === 1) {
        subArrayIndex = Math.floor(elementIndex / 2)
    }
    else if (rowIndex === 2) {
        subArrayIndex = Math.floor(elementIndex / 4);
        console.log("subindex2: "+subArrayIndex);
    }
    else if (rowIndex === 3) {
        subArrayIndex = 1;
    }

    // ROW 1
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
    else if (rowIndex === 2) {
        currentSubArray = rowArray[subArrayIndex];

        for (let element of currentSubArray) {
            console.log("subarrayloop: "+element.textContent);
        }

        if (elementIndex < 4) {
            leftElements.push(...currentSubArray.slice(0, 1));
            rightElements.push(...currentSubArray.slice(2, 3));
        }
        else {
            leftElements.push(...currentSubArray.slice(4, 5));
            rightElements.push(...currentSubArray.slice(6, 7));
        }

        if (direction == "left") {
            // GET SMALLEST VALUE OF LEFTELEMENTS
            console.log("LOGLEFT"+leftElements);
            
            leftElements.sort();
            leftElement = leftElements[0];
            
            console.log("leftElement: " + leftElement);

            moveDownElement(leftElement);
        } else if (direction == "right") {
            // GET SMALLEST VALUE OF RIGHTELEMENTS
            
            rightElements.sort();
            rightElement = rightElements[0];
            

            moveDownElement(rightElement);
        }

    }

}

let nextRowElements;
let currentRowElements;

function moveDownElement(elementToMove) {

    if (rowIndex === 1) {
        subArrayIndex = Math.floor(elementIndex / 2)
    }
    else if (rowIndex === 2) {
        subArrayIndex = Math.floor(elementIndex / 4)
    }
    else if (rowIndex === 3) {
        subArrayIndex = 1;
    }


    console.log("subarrayindx: " + subArrayIndex);

    console.log("to move: " + getValue(elementToMove));
    console.log("smallest value in move: " + getSmallestValue(rowArray[subArrayIndex]));
    if (getValue(elementToMove) !== getSmallestValue(rowArray[subArrayIndex])) {
        console.log("Not smallest element");
        return;
    }
    else {
        const indexOfMovedElement = rowArray[subArrayIndex].indexOf(elementToMove);
        if (indexOfMovedElement > -1) { // only splice array if an element is found
            console.log("REMOVING element: " + elementToMove.textContent);
            rowArray[subArrayIndex].splice(indexOfMovedElement, 1); //  remove one item only
        }
        nextRowElements = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
        nextRowElements[elementIndex].textContent = parseInt(elementToMove.textContent);
    }


    /*
    if (rowIndex !== 3) {
        currentRowElements = document.querySelectorAll(`.game-element-row-${rowIndex}`);
        nextRowElements = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
    }
        


    nextRowElements[elementIndex].textContent = parseInt(elementToMove.textContent);
*/

    allowedMoveMade = true;
}

/*
function moveLeftElement() {
    let leftElementValue = parseInt(leftElement.textContent);
    let rightElementValue = parseInt(rightElement.textContent);

    // IF user has already made a left move this turn / set of elements, they can not do it again
    if (leftMoveMade && rowIndex === 1) {
        moveExplanationText.textContent = "Wrong! Try again."
        return;
    }

    // IF user made a right move, then they can now make a left move (even if that element is bigger)
    if (rightMoveMade && rowIndex === 1) {
        elementList2[elementIndex].textContent = leftElementValue;
        allowedMoveMade = true;
        rightMoveMade = false;
        return;
    }

    //if value of left element is bigger than the right one the value cannot be moved down
    if (leftElementValue > rightElementValue) {
        moveExplanationText.textContent = "Wrong! Try again."
        return;
    }
    elementList2[elementIndex].textContent = leftElementValue;
    allowedMoveMade = true;
    leftMoveMade = true;
}

function moveRightElement() {
    let leftElementValue = parseInt(leftElement.textContent);
    let rightElementValue = parseInt(rightElement.textContent);
    console.log("leftElementValue (move right): " + leftElementValue);
    console.log("rightElementValue (move right): " + rightElementValue);

    // IF user has already made a right move this turn / set of elements, they can not do it again
    if (rightMoveMade) {
        moveExplanationText.textContent = "Wrong! Try again."
        return;
    }

    // IF user made a right move, then they can now make a right move (even if that element is bigger)
    if (leftMoveMade) {
        elementList2[elementIndex].textContent = rightElementValue;
        allowedMoveMade = true;
        leftMoveMade = false;
        return;
    }

    //if value of right element is bigger than the left one the value cannot be moved down
    if (rightElementValue > leftElementValue) {
        console.log("rightElementValue in right if: " + rightElementValue);
        console.log("leftElementValue in right if: " + leftElementValue);
        moveExplanationText.textContent = "Wrong! Try again."
        return;
    }
    elementList2[elementIndex].textContent = rightElementValue;
    allowedMoveMade = true;
    rightMoveMade = true;
}

*/

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

    // remove highlighted class after game is over
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
    }
    // reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index;
    }
    elementList = null;

}