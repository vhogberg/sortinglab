/* Viktor Högberg, Léo Tuomenoksa Texier */

// Switches between light and dark mode
document.getElementById("theme-toggle-button").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
})

// When clicking on the "SortingLab"  logo,
document.getElementById("logo-container").addEventListener("click", () => {
    window.location.href = "index.html";
})
