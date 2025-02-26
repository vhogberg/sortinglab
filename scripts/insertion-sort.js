// Start button
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
let elementList = document.querySelectorAll(".game-element");

// Global variables of the current two elements selected
let selectedElement;
let element2;

let correctMoves = 0;
let wrongMoves = 0;

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 10); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
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


// async loop so that it waits for button presses
async function gameLoop() {
    // for loop, using list length
    for (let index = 0; index < elementList.length; index++) {
        console.log("CURRENT LOOP = " + index);
        // grab current indexed element and the one to the left of it
        selectedElement = elementList[index];
        console.log("SELECTED ELEMENT = " + selectedElement.textContent);
        if (index != 0) {
            element2 = elementList[index - 1];
            console.log("ELEMENT2 = " + element2.textContent);
        }

        leftButton.addEventListener("click", swapElements);

        // add visualisation for selected elements
        selectedElement.classList.add("game-element-highlighted");

        // wait for button press
        await waitForButtonPress();

        // remove visualisation for selected elements after button press
        selectedElement.classList.remove("game-element-highlighted");
        leftButton.removeEventListener("click", swapElements)
    }
}

// Function that stops the for loop, waiting for a button press
async function waitForButtonPress() {

    return new Promise(resolve => {

        function handleClick(event) {
            skipButton.removeEventListener("click", handleClick);
            resolve(event.target.id);
        }

        // skip
        skipButton.addEventListener("click", skip);
        skipButton.addEventListener("click", handleClick);
    }
    )
}

//swaps the two marked elements
function swapElements() {
    /*
    if (element1.textContent > element2.textContent) {
        moveExplanationText.textContent = "Correct! " + element1.textContent + " is bigger than " + element2.textContent + " so they should be swapped!";
        correctMoves++;
    } else if (element1.textContent === element2.textContent) {
        moveExplanationText.textContent = "Wrong! " + element1.textContent + " is equal to " + element2.textContent + " so they should not be swapped!";
        wrongMoves++;
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1.textContent + " is smaller than " + element2.textContent + " so they should not be swapped!";
        wrongMoves++;
    }
    */

    console.log("swapping")
    // gets the parentElement of the first element, ie the container that contains all elements
    let parentElement = selectedElement.parentElement;

    //moves SELECTED element to LEFT OF element2, swapping them
    parentElement.insertBefore(selectedElement, element2);

    //since the index of the elements gets shuffled around by swapping them, we reasign all elements to the nodeList to ensure they are in the correct order.
    elementList = document.querySelectorAll(".game-element");

    let elementArray = Array.from(elementList);

    let selectedElementIndex = elementArray.indexOf(selectedElement);
    console.log(selectedElementIndex);

    element2 = elementList[selectedElementIndex - 1];
}

// skip function
function skip() {
    // check if move is correct (i.e whether user should've skipped)
    /*
    if (element1.textContent < element2.textContent) {
        moveExplanationText.textContent = "Correct! " + element1.textContent + " is smaller than " + element2.textContent + " so they should not be swapped!";
        correctMoves++;
    } else if (element1.textContent === element2.textContent) {
        moveExplanationText.textContent = "Correct! " + element1.textContent + " is equal to " + element2.textContent + " so they should not be swapped!";
        wrongMoves++;
    }
    else {
        moveExplanationText.textContent = "Wrong! " + element1.textContent + " is bigger than " + element2.textContent + " so they should be swapped!";
        wrongMoves++;
    }
        */
}

// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    elementList = document.querySelectorAll(".game-element");

    // Made a new array containing the values (numbers or letters)
    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        console.log(valueArray[index] = elementList[index].textContent);
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
    skipButton.classList.add("disabled");
    submitButton.classList.add("disabled");


    // reset the indexes in list
    elementList = document.querySelectorAll(".game-element");

    // Reset points for next round
    wrongMoves = 0;
    correctMoves = 0;

    for (let index = 0; index < elementList.length; index++) {
        elementList[index].classList.remove("game-element-highlighted");
    }
}