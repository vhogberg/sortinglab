/* Viktor Högberg, Léo Tuomenoksa Texier */

import { handleLives, isLivesEnabled, isPointsDisabled } from "./game-options.js";
import { playErrorSound } from "./sound.js";

// POINTS HANLDING

// local variables
let correctMoves = 0;
let wrongMoves = 0;

// increase correct moves
export function increaseCorrectMoves() {
    correctMoves++;
}

// increase incorrect moves
export function increaseIncorrectMoves() {
    if(!isPointsDisabled()) {
        playErrorSound();
    }
    wrongMoves++;
    if (isLivesEnabled()) {
        handleLives();
    }
}

// getters
export function getCorrectMoves() {
    return correctMoves;
}

export function getIncorrectMoves() {
    return wrongMoves;
}

// reset when a game is over
export function resetScore() {
    correctMoves = 0;
    wrongMoves = 0;
}

// Check if the user has an acceptable error rate
export function isScoreGood() {
    if (wrongMoves > correctMoves * 0.4) {
        return false;
    }
    return true;
}
