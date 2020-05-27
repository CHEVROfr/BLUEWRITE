let fullscreen = document.getElementById("fullscreen")
let fullscreen_icon_enter = document.getElementById("fullscreen_enter")
let fullscreen_icon_exit = document.getElementById("fullscreen_exit")

/*********************** FULL SCREEN */
var isFullScreen = false
fullscreen.onclick = () => {
    if(isFullScreen) {
        closeFullscreen()
        isFullScreen = false
    }
    else {
        openFullscreen()
        isFullScreen = true
    }
}

var elem = document.documentElement
function openFullscreen() {
    fullscreen_icon_enter.style.display = "none"
    fullscreen_icon_exit.style.display = "block"

    if(elem.requestFullscreen) {
        elem.requestFullscreen()
    } 
    else if(elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen()
    } 
    else if(elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
    } 
    else if(elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen()
    }
}
function closeFullscreen() {
    fullscreen_icon_enter.style.display = "block"
    fullscreen_icon_exit.style.display = "none"

    if(document.exitFullscreen) {
        document.exitFullscreen()
    } 
    else if(document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen()
    } 
    else if(document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
    } 
    else if(document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen()
    }
}