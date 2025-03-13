/* Viktor Högberg, Léo Tuomenoksa Texier */

setDarkMode();
window.onload = handleVideo;
//runs at the start of every document load and checks if dark mode and sound has been set by the user
//and activates toggles them if they have been set
function setDarkMode() {
    if (localStorage.getItem('theme') === "dark") {
        document.documentElement.classList.add("dark-mode");
        //no need to keep going if theme is already dark
        return;
    }

    //asks if dark mode is active in browser, and activates it if it is and user has not set theme to light mode
    if (localStorage.getItem('theme') != "light" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark-mode");
        //adds dark mode as active here to ensure event listener check works properly
        localStorage.setItem('theme', 'dark');
    }

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
}

// When clicking on the "SortingLab"  logo,
document.getElementById("logo-container").addEventListener("click", () => {
    window.location.href = "index.html";
})

//adds eventlistener to each video on the home page, enabling them to play and pause as the mouse is moving over them.
function handleVideo() {
    const videos = document.querySelectorAll('.algorithm-example-video');
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



