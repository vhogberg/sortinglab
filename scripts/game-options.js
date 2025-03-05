/* Viktor Högberg, Léo Tuomenoksa Texier */

let livesEnabled = false;
let timeEnabled = false;
let pointsEnabled = false;

export function handleGameOptions() {
    handleGamePreferences();
    handleGameMode();
    handleGameDifficulty();
}

function handleGamePreferences() {
    // Lives
    if (document.getElementById("lives-checkbox").checked) {
        document.getElementById("lives-container").classList.remove("hidden");
        livesEnabled = true;
        console.log("Lives enabled");
    } else {
        console.log("Lives disabled");
        document.getElementById("lives-container").classList.add("hidden");
        livesEnabled = false;
    }

    // Time
    if (document.getElementById("time-checkbox").checked) {
        timeEnabled = true;
        document.getElementById("time-container").classList.remove("hidden");
        console.log("Time limit enabled");
    } else {
        console.log("Time limit disabled");
        document.getElementById("time-container").classList.add("hidden");
        timeEnabled = false;
    }

    // Points
    if (document.getElementById("points-checkbox").checked) {
        console.log("Points enabled");
        pointsEnabled = true;
    } else {
        console.log("Points disabled");
        pointsEnabled = false;
    }
}

function handleGameMode() {
    // Numbers
    if (document.getElementById("number-mode").checked) {
        console.log("Number mode enabled");
    } else {
        console.log("Number mode  disabled");
    }

    // Letters
    if (document.getElementById("letter-mode").checked) {
        console.log("Letter mode enabled");
    } else {
        console.log("Letter mode disabled");
    }
    
}

function handleGameDifficulty() {
    if (document.getElementById("easy-difficulty").checked) {
        console.log("Easy difficulty enabled");
    } else {
        console.log("Easy mode disabled");
    }

    // Letters
    if (document.getElementById("normal-difficulty").checked) {
        console.log("Normal difficulty enabled");
    } else {
        console.log("Normal difficulty disabled");
    }

    // Letters
    if (document.getElementById("hard-difficulty").checked) {
        console.log("Hard difficulty enabled");
    } else {
        console.log("Hard difficulty disabled");
    }
    
}

export function isPointsDisabled() {

}

export function isLivesEnabled() {
    return livesEnabled;
}


export function loseLives() {

}