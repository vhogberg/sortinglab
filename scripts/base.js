/* Viktor Högberg, Léo Tuomenoksa Texier */
window.onload = initialise;

//runs at the start of every document load and checks if dark mode and sound has been set by the user
//and activates toggles them if they have been set
function initialise() {
    if (localStorage.getItem('theme') == "dark") {
        document.documentElement.classList.add("dark-mode");
        //no need to keep going since dark mode has already been set
        return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('theme') != "light") {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add("dark-mode");
    }
}

// Switches between light and dark mode
document.getElementById("theme-toggle-button").addEventListener("click", () => {
    //if dark mode is active and user clicks theme button, remove dark mode and set current theme to light
    if (localStorage.getItem('theme') == "dark") {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove("dark-mode");
    } else {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add("dark-mode");
    }

})

// When clicking on the "SortingLab"  logo,
document.getElementById("logo-container").addEventListener("click", () => {
    window.location.href = "index.html";
})
