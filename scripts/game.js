/* Viktor Högberg, Léo Tuomenoksa Texier */

let correctMoves = 0;
let wrongMoves = 0;

export function increaseCorrectMoves() {
    correctMoves++;
}

export function increaseIncorrectMoves() {
    wrongMoves++;
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
