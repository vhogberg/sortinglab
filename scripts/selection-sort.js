// Start button
const startButton = document.getElementById("start-button");
const selectButton = document.getElementById("select-button");
const skipButton = document.getElementById("next-button");
const moveButton = document.getElementById("move-button");

const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

submitButton.classList.add("disabled");
selectButton.classList.add("disabled");
skipButton.classList.add("disabled");

let moveExplanationText = document.getElementById("move-explanation");

moveButton.classList.add("hidden");

// Initial sorted list of all elements
let elementList;

// Global variables of the two elements
let selectedElement;
let smallestElement;

let correctMoves = 0; // for points
let wrongMoves = 0; // for points

// for looping logic
let allowedMoveMade = false;
let skipIndex;
let index = 0;

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 10); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

// Function to start the game, hides theory and starts the loop.
function startGame() {
    selectButton.classList.remove("disabled");
    skipButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");

    scrambleElements();
    gameLoop();
}

// async game loop waiting for button presses
async function gameLoop() {

    // goes through the entire list of elements, of variable length
    while (index < elementList.length) {
        allowedMoveMade = false;
        skipButton.classList.remove("hidden");
        moveButton.classList.add("hidden");
        moveExplanationText.textContent = "";

        // smallest element should always be the first selected element at the start
        selectedElement = elementList[index];
        smallestElement = elementList[index];

        skipIndex = index;

        // add visualisation for selected element
        selectedElement.classList.add("game-element-highlighted");
        smallestElement.classList.add("smallest-game-element");

        // add button listeners, wait for a valid move (correct game-wise buttno press), then remove button listenerrs
        selectButton.addEventListener("click", selectSmallestElement);
        skipButton.addEventListener("click", skip);
        moveButton.addEventListener("click", handleMove);
        await waitForValidMove();
        moveButton.removeEventListener("click", handleMove);
        selectButton.removeEventListener("click", selectSmallestElement);
        skipButton.removeEventListener("click", skip);

        selectedElement.classList.remove("game-element-highlighted");
    }
    moveExplanationText.textContent = "No further elements to sort, click submit!";
}

// await function for a correct move that continues the game loop
function waitForValidMove() {
    return new Promise(resolve => {
        function checkValidMove() {
            if (allowedMoveMade) {
                index++; // next loop
                resolve();
                removeEventListeners();
            }
        }

        function removeEventListeners() {
            selectButton.removeEventListener("click", checkValidMove);
            skipButton.removeEventListener("click", checkValidMove);
            moveButton.removeEventListener("click", checkValidMove);
        }

        selectButton.addEventListener("click", checkValidMove);
        skipButton.addEventListener("click", checkValidMove);
        moveButton.addEventListener("click", checkValidMove);
    })
}

// Function that skips over a selected element and looks for more elements
function skip() {
    // Control so that user does not skip over a value they should not (would break the algorithm)
    if (parseInt(selectedElement.textContent) < parseInt(smallestElement.textContent)) {
        moveExplanationText.textContent = "Wrong! " + selectedElement.textContent + " is smaller than " + smallestElement.textContent + " so it should become the new minimum value!";
        wrongMoves++;
        return;
    }

    //TODO() FIX POINTS

    // At the end of the list of elements, move button shows up to move the smallest element to the left.
    if (skipIndex >= elementList.length - 1) {
        skipButton.classList.add("hidden");
        moveButton.classList.remove("hidden");
        moveExplanationText.textContent = "The smallest element has been selected, click the move button!";
        return;
    }
    // clear explanation text after each skip
    moveExplanationText.textContent = "";

    // update styling for next element
    selectedElement.classList.remove("game-element-highlighted");
    selectedElement = elementList[skipIndex + 1];
    selectedElement.classList.add("game-element-highlighted");

    // go to next element
    skipIndex++;

    // Ensure the element list is updated after possible swaps
    elementList = document.querySelectorAll(".game-element");
}

//handles selection of an element
function selectSmallestElement() {
    //if element user has selected is smaller than current smallest element
    if (parseInt(selectedElement.textContent) < parseInt(smallestElement.textContent)) {
        moveExplanationText.textContent = "Correct! " + selectedElement.textContent + " is smaller than " + smallestElement.textContent + " so it should become the new minimum value!";
        smallestElement.classList.remove("smallest-game-element");

        //updates the current smallest element to the smaller one selected by the user
        smallestElement = selectedElement;
        smallestElement.classList.add("smallest-game-element");
        correctMoves++;
        //if it is the same element
    } else if (selectedElement == smallestElement) {
        moveExplanationText.textContent = "This element is already selected!";
        //if it is another element with the same value
    } else if (parseInt(selectedElement.textContent) == parseInt(smallestElement.textContent)) {
        moveExplanationText.textContent = "This element is the same size as the already selected value!";
        wrongMoves++;
        //if element user has selected is bigger than currently selected element
    } else {
        moveExplanationText.textContent = "This element is bigger than the selected value!";
        wrongMoves++;
    }
}

// If user does an allowed move, swap elements and continnue loop
function handleMove() {
    allowedMoveMade = true;
    smallestElement.classList.remove("smallest-game-element");
    smallestElement.classList.add("sorted-element");
    swapElements();
}


// Swaps the SELECTED element with element to the left of selected element
function swapElements() {

    // gets the parentElement of the first element, ie the container that contains all elements
    let parentElement = selectedElement.parentElement;

    firstElement = elementList[index];

    //moves SELECTED element to LEFT OF element2, swapping them
    parentElement.insertBefore(smallestElement, firstElement);

    //since the index of the elements gets shuffled around by swapping them, we reasign all elements to the nodeList to ensure they are in the correct order.
    elementList = document.querySelectorAll(".game-element");
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
    skipButton.classList.remove("hidden");
    moveButton.classList.add("hidden");

    selectButton.classList.add("disabled");
    skipButton.classList.add("disabled");
    submitButton.classList.add("disabled");

    selectedElement = undefined;
    smallestElement = undefined;
    // Reset points for next round
    wrongMoves = 0;
    correctMoves = 0;

    moveExplanationText.textContent = "";

    // remove highlighted class after game is over
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
        elementList[index].classList.remove("smallest-element");
        elementList[index].classList.remove("sorted-element");
    }

    // reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index;
    }
    elementList = null;
    index = 0;
}