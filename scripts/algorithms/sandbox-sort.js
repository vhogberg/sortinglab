/* Viktor Högberg, Léo Tuomenoksa Texier */

const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const theoryView = document.getElementById("theory-view");
const gameElementList = document.getElementById("game-element-list");

submitButton.addEventListener("click", checkIfSorted);
startButton.addEventListener("click", startGame);

let moveExplanationText = document.getElementById("move-explanation");

submitButton.classList.add("disabled");

// Initial sorted list of all elements
let elementList;

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
    
    alert("Sorted!");

    // reset ordering on theoryview
    for (let index = 0; index < elementList.length; index++) {
        elementList[index].innerHTML = index;
    }
    elementList = null;
}