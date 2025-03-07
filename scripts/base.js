/* Viktor Högberg, Léo Tuomenoksa Texier */

import { muteSound, unMuteSound } from "./sound.js";

// Switches between light and dark mode
document.getElementById("theme-toggle-button").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
})

// When clicking on the "SortingLab"  logo,
document.getElementById("logo-container").addEventListener("click", () => {
    window.location.href = "index.html";
})

const soundChechbox = document.getElementById("sound-checkbox");
// if sound checkbox is checked, play sound, else mute it
soundChechbox.addEventListener("change", function() {
    if (this.checked) {
        unMuteSound();
    }
    else {
        muteSound();
    }
});