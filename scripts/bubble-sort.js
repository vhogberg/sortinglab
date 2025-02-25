// Start button
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

// Initial sorted list of all elements
let elementList = document.querySelectorAll(".game-element");

// Global variables of the current two elements selected
let element1;
let element2;

// Boolean for while loop running the game
let gameRunning = true;

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 100); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
    startButton.disabled = true; // disable start button so user can't reshuffle
    startButton.style.cursor = 'default';
}

function startGame() {
    scrambleElements();
    gameLoop();
}

// async loop so that it waits for button presses
async function gameLoop() {
    while (gameRunning) {
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

        const skipButton = document.getElementById("skip-button");
        const swapButton = document.getElementById("swap-button");

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
    console.log("swapped!");
    //gets the parentElement of the first element, ie the game-element-container that contains all elements
    let parentElement = element1.parentElement;
    //checks if element1 is next sibling of element2
    if (element2.nextSibling === element1) {
        //moves element1 to be fefore element2
        parentElement.insertBefore(element1, element2);
        console.log("element1 before element2")
    }
    else {
        //else moves element2 to be before element1
        parentElement.insertBefore(element2, element1);
        console.log("element2 before element1")

    }
    //since the index of the elements gets shuffled around by swapping them, we reasign all elements to the nodeList to ensure they are in the correct order.
    elementList = document.querySelectorAll(".game-element");

}

function skip() {
    console.log("skipped!")
}

function checkIfSorted() {
    
}

function gameOver() {
    startButton.disabled = false;
}