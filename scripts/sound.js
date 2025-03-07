/* Viktor Högberg, Léo Tuomenoksa Texier */

// SOUND EFFECT HANDLING

// list of sounds
let errorSound = new Audio('../assets/sound-effects/error-sound-effect.mp3');
let tickingSound = new Audio('../assets/sound-effects/ticking-sound-effect.mp3');
let gameOverSuccessSound = new Audio('../assets/sound-effects/game-over-success-sound-effect.mp3');
let gameOverFailSound = new Audio('../assets/sound-effects/game-over-fail-sound-effect.mp3');

// volume control
errorSound.volume = 0.03;
gameOverSuccessSound.volume = 0.15;
gameOverFailSound.volume = 0.03;
tickingSound.volume = 0.05;

// mute control
let isMuted = false;

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

// mute functions
export function muteSound () {
    isMuted = true;
}

export function unMuteSound () {
    isMuted = false;
}

export function isSoundMuted() {
    return isMuted;
}