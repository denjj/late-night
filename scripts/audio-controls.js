"use strict"

//
// Variables
//
const widgetIFrame = document.getElementById("scWidget"); // Initialize and hide soundcloud iframe widget
const widget = SC.Widget(widgetIFrame);
widgetIFrame.style.display = "none";

const playToggle = document.getElementById("playPause");
const playPrev = document.getElementById("prev");
const playNext = document.getElementById("next");

const volumeSlider = document.getElementById("volumeSlider");
const volumeVal = document.getElementById("volumeVal");
volumeVal.textContent = volumeSlider.value;

const seekSlider = document.getElementById("seekSlider");
const seekVal = document.getElementById("seekVal");
const seekMax = document.getElementById("seekMax");

const title = document.getElementById("titleLink");
const artist = document.getElementById("artistLink");
const artwork = document.getElementById("artwork");

//
// Functions
//

function convertSongTime(ms){
        let time = ms / 1000;
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds.toString().padStart(2,"0");
        return minutes + ":" + seconds;

};

//
// Inits & Event Listeners
//
playToggle.addEventListener("click", () => {widget.toggle();});
playPrev.addEventListener("click", () => {widget.prev();});
playNext.addEventListener("click", () => {widget.next();});

volumeSlider.addEventListener("input", function() {
    volumeVal.textContent = this.value;
    widget.setVolume(this.value);
})

seekSlider.addEventListener("input", function() {
    widget.seekTo(this.value);
})

// Get & update information about currently playing sound
widget.bind(SC.Widget.Events.READY, () => {
    widget.bind(SC.Widget.Events.PLAY, () => {
        widget.getCurrentSound(currentSound => {
        console.log(currentSound);
        artwork.src = currentSound.artwork_url;
        title.textContent = currentSound.title;
        artist.textContent = currentSound.user.username;
        title.setAttribute("href", currentSound.permalink_url);
        artist.setAttribute("href", currentSound.user.permalink_url);
        seekMax.textContent = convertSongTime(currentSound.duration);
        });
    });
    });

// Update seekerbar text value & movement while the track is playing
widget.bind(SC.Widget.Events.PLAY_PROGRESS, () => {
    widget.getPosition(position => {
        widget.getDuration(duration => {
        seekSlider.max = duration;
        seekSlider.value = position;
        seekVal.textContent = convertSongTime(position);
        });
    });
    })
    
    

