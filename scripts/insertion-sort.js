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

// Global variables of the current two elements
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
        if (index != 0) {
            element2 = elementList[index - 1];
        }

        // add eventlistener to left (swap) button here, button can be pressed multiple times until listener is removed
        leftButton.addEventListener("click", swapElements);

        // add visualisation for selected element
        selectedElement.classList.add("game-element-highlighted");

        // Disable skip if left element exists and is greater
        if (element2 && parseInt(element2.textContent) > parseInt(selectedElement.textContent)) {
            skipButton.disabled = true;
        } else {
            skipButton.disabled = false;
        }

        // wait for SKIP-button press
        await waitForSkipButtonPress();

        // TODO() This text never shows up.
        if (element2 && parseInt(element2.textContent) > parseInt(selectedElement.textContent)) {
            moveExplanationText.textContent = "You can't skip here! The element to the left is bigger, so you must swap.";
        }

        // remove visualisation for selected elements after button press
        selectedElement.classList.remove("game-element-highlighted");

        // remove button event listener for left (swap) button after skip is pressed.
        leftButton.removeEventListener("click", swapElements)
    }
}

// Function that stops the for loop, waiting for a SKIP-button press
async function waitForSkipButtonPress() {
    return new Promise(resolve => {

        function handleClick(event) {
            skipButton.removeEventListener("click", handleClick);
            resolve(event.target.id);
        }

        // SKIP ONLY
        skipButton.addEventListener("click", skip);
        skipButton.addEventListener("click", handleClick);
    })
}

function skip() {
    let selectedValue = parseInt(selectedElement.textContent);
    let element2Value = element2 ? parseInt(element2.textContent) : undefined;

    // Ensure the element list is updated after possible swaps
    elementList = document.querySelectorAll(".game-element");

    if (!element2) {
        moveExplanationText.textContent = "Correct! You should always skip when the selected element is furthest to the left!";
        correctMoves++;
        skipButton.disabled = false; // Always allow skipping for the first element
        return;
    }

    if (selectedValue < element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is smaller than " + element2Value + " so it should be swapped!";
        wrongMoves++;
        return;
    }

    if (selectedValue > element2Value) {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is bigger than " + element2Value + " so it should be skipped!";
        correctMoves++;
    } else {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is equal to " + element2Value + " so they should be skipped!";
        correctMoves++;
    }

    skipButton.disabled = false; // Allow skipping if it's valid
}

// Swaps the SELECTED element with element to the left of selected element
function swapElements() {

    let selectedValue = parseInt(selectedElement.textContent);

    // Check if element2 exists before accessing its textContent
    let element2Value = element2 ? parseInt(element2.textContent) : undefined;

    if (element2 === undefined) {
        moveExplanationText.textContent = "Wrong! You can't move this further to the left!";
        // TODO("Update to selection sort theory");
        wrongMoves++;
        return;
    }
    else if (selectedValue > element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is bigger than " + element2Value + " so they should not be swapped!";
        wrongMoves++;
        return;
    }
    else if (selectedValue === element2Value) {
        moveExplanationText.textContent = "Wrong! " + selectedValue + " is equal to " + element2Value + " so they should not be swapped!";
        wrongMoves++;
        return;
    }
    else {
        moveExplanationText.textContent = "Correct! " + selectedValue + " is smaller than " + element2Value + " so they should be swapped!";
        correctMoves++;
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

    // Should not be able to skip when element2 is bigger
    if (element2 !== undefined && element2.textContent > selectedElement.textContent) {
        skipButton.disabled = true;
    }
    else {
        skipButton.disabled = false;
    }
    elementList = document.querySelectorAll(".game-element");
}



// Function to check if a given set of elements is sorted correctly
function checkIfSorted() {
    elementList = document.querySelectorAll(".game-element");

    // Made a new array containing the values (numbers or letters)
    const valueArray = [];
    for (let index = 0; index < elementList.length; index++) {
        console.log(valueArray[index] = parseInt(elementList[index].textContent));
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