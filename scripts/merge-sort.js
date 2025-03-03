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
    elementList2 = document.querySelectorAll(".game-element-row-2");
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

async function gameLoop() {
    while (rowIndex < 4) {
        while (elementIndex < 8) {
            console.log("Element index: " + elementIndex)
            allowedMoveMade = false;

            // ROW 1
            if (rowIndex === 1) {
                if (elementIndex % 2 === 0) {
                    leftElement = elementList[elementIndex];
                    rightElement = elementList[elementIndex + 1];
                    console.log("left 1: " + leftElement.textContent);
                    console.log("right 1: " + rightElement.textContent);
                }
                else {
                    leftElement = elementList[elementIndex - 1];
                    rightElement = elementList[elementIndex];
                    console.log("left 2: " + leftElement.textContent);
                    console.log("right 2: " + rightElement.textContent);
                }
            }
            
            // ROW 2
            else if (rowIndex === 2) {
                if (elementIndex < 4) {
                    leftElement = elementList[elementIndex];
                    rightElement = elementList[elementIndex + 2];
                }
                else {
                    leftElement = elementList[elementIndex + 2];
                    rightElement = elementList[elementIndex];
                }
            }
            else {
                
            }


            leftElement.classList.add("marked-left");
            rightElement.classList.add("marked-right");

            leftButton.addEventListener("click", moveLeftElement);
            rightButton.addEventListener("click", moveRightElement);
            await waitForValidMove();

            leftElement.classList.remove("marked-left");
            rightElement.classList.remove("marked-right");
            leftButton.removeEventListener("click", moveLeftElement);
            rightButton.removeEventListener("click", moveRightElement);
        }
        rowIndex++
        elementIndex = 0;
        elementList = document.querySelectorAll(`.game-element-row-${rowIndex}`);
        elementList2 = document.querySelectorAll(`.game-element-row-${rowIndex + 1}`);
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

let leftMoveMade = false;
let rightMoveMade = false;


function moveLeftElement() {
    let leftElementValue = parseInt(leftElement.textContent);
    let rightElementValue = parseInt(rightElement.textContent);

    // IF user has already made a left move this turn / set of elements, they can not do it again
    if (leftMoveMade) {
        moveExplanationText.textContent = "Wrong! Try again."
        return;
    }

    // IF user made a right move, then they can now make a left move (even if that element is bigger)
    if (rightMoveMade) {
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