/* Viktor Högberg, Léo Tuomenoksa Texier */

// ------------------------- SOUND EFFECTS -----------------------------

// list of sounds
let errorSound = new Audio('./assets/sound-effects/error-sound-effect.mp3');
let tickingSound = new Audio('./assets/sound-effects/ticking-sound-effect.mp3');
let gameOverSuccessSound = new Audio('./assets/sound-effects/game-over-success-sound-effect.mp3');
let gameOverFailSound = new Audio('./assets/sound-effects/game-over-fail-sound-effect.mp3');

// volume control
errorSound.volume = 0.03;
gameOverSuccessSound.volume = 0.15;
gameOverFailSound.volume = 0.03;
tickingSound.volume = 0.05;

// play functions
export function playErrorSound() {
    if (!isMuted) {
        errorSound.play();
    }
}

export function playTickingSound() {
    if (!isMuted) {
        tickingSound.play();
    }

}

export function playGameOverSuccessSound() {
    if (!isMuted) {
        gameOverSuccessSound.play();
    }
}

export function playGameOverFailSound() {
    if (!isMuted) {
        gameOverFailSound.play();
    }
}

// ------------------------- MUTE CONTROL ------------------------------

let isMuted = getCookie("muteSound") === "true";

const soundCheckbox = document.getElementById("sound-checkbox");

// if sound checkbox is checked, play sound, else mute it
soundCheckbox.addEventListener("change", function() {
    if (this.checked) {
        unMuteSound();
    }
    else {
        muteSound();
    }
});

function updateMutedCheckbox() {
    soundCheckbox.checked = !isMuted;
}

// set a cookie with a name, value (true or false) and days it should be for
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // multiply to date format
    document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + ";path=/";
}

// get a cookie by its name
function getCookie(name) {
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let characterArray = decodedCookie.split(';');
    
    for (let i = 0; i < characterArray.length; i++){
        let char = characterArray[i];
        while (char.charAt(0) == ' ') {
            char = char.substring(1);
        }
        if(char.indexOf(name) == 0) {
            return char.substring(cookieName.length, char.length);
        }
        else return "";
    }
}

// mute functions
export function muteSound () {
    isMuted = true;
    setCookie("muteSound", "true", 7); // 7 days
    updateMutedCheckbox();
    console.log("cookies: "+document.cookie);
}

export function unMuteSound () {
    isMuted = false;
    setCookie("muteSound", "false", 7); // 7 days
    updateMutedCheckbox();
    console.log("cookies: "+document.cookie);
}

export function isSoundMuted() {
    return isMuted;
}