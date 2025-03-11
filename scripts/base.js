/* Viktor Högberg, Léo Tuomenoksa Texier */

window.onload = initialise;
const videos = document.querySelectorAll('.algorithm-example-video');

//TODO fix because you can't use light mode if you have dark mode set in broswer

//runs at the start of every document load and checks if dark mode and sound has been set by the user
//and activates toggles them if they have been set
function initialise() { //TODO improve dark mode implementation
    handleVideo();
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

function handleVideo() {
    videos.forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play();
        });
            
        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
        //for compatability with mobile, allows user to click the video to start it
        video.addEventListener('click', () => {
            video.play();
        });
    });
}



