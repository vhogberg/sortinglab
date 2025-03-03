/* Viktor Högberg, Léo Tuomenoksa Texier */

const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const gameContainer = document.getElementById("game-element-container");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

let moveExplanationText = document.getElementById("move-explanation");

submitButton.classList.add("disabled");

// Initial sorted list of all elements
let elementList;

var dragging = null;

gameContainer.addEventListener("dragstart", (event) => {
    var target = getTarget(event.target);
})

gameContainer.addEventListener('dragenter', (event) => {
    event.target.style['border-right'] = 'solid 4px yellow';
})

gameContainer.addEventListener('dragleave', (event) => {
    event.target.style['border-right'] = '';

})

gameContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
})

gameContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    alert("dropped something!");

})

function getTarget(target) {
    
}





// The element you are currently "holding"
let selectedElement;

// Function to scramble the elements so they are unsorted
function scrambleElements() {
    elementList = document.querySelectorAll(".game-element");
    for (const element of elementList) {
        element.innerHTML = Math.floor(Math.random() * 10); // change this value to 10 or increase to 1000 to change how big the numbers are that should be sorted
    }
}

// Function to start the game, hides theory and starts the loop.
function startGame() {
    submitButton.classList.remove("disabled");
    startButton.classList.add("hidden");
    theoryView.classList.add("hidden");

    scrambleElements();
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
        moveExplanationText.textContent = "The elements are not sorted correctly yet!"
    }
}

// Function called if user clicks submit and the array is sorted
function gameOver() {
    // enable startButton again for new round
    startButton.classList.remove("hidden");
    theoryView.classList.remove("hidden");

    submitButton.classList.add("disabled");


    // reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index;
    }
    elementList = null;
}