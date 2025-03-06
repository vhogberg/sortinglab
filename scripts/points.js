/* Viktor Högberg, Léo Tuomenoksa Texier */
import { handleLives, isLivesEnabled } from "./game-options.js";

let correctMoves = 0;
let wrongMoves = 0;

export function increaseCorrectMoves() {
    correctMoves++;
}

export function increaseIncorrectMoves() {
    wrongMoves++;
    if (isLivesEnabled()) {
        handleLives();
    }
}

export function getCorrectMoves() {
    return correctMoves;
}

export function getIncorrectMoves() {
    return wrongMoves;
}

export function resetScore() {
    correctMoves = 0;
    wrongMoves = 0;
}

export function isScoreGood() {
    if (wrongMoves > correctMoves * 0.4) {
        return false;
    }
    return true;
}
