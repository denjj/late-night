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
const shuffle = document.getElementById("shuffle");

const volumeSlider = document.getElementById("volumeSlider");

const seekSlider = document.getElementById("seekSlider");
const seekText = document.getElementById("seekText");
const seekTextMax = document.getElementById("seekTextMax");

const title = document.getElementById("titleLink");
const artist = document.getElementById("artistLink");
const artwork = document.getElementById("artwork");
let trackList = []; // represented as an array of integers for use with soundcloud api calls for playback
let trackIndex = 0;


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

function playTrack(){
    widget.toggle();

    widget.isPaused((paused) =>{
        if (paused){
            playToggle.childNodes[0].className = "fas fa-play-circle";
        } else {
            playToggle.childNodes[0].className = "fas fa-pause-circle";
        }
    })

}

function playPrevTrack(){
    if (trackIndex > 0){
        trackIndex--;
        widget.skip(trackList[trackIndex]);
    }
    playToggle.childNodes[0].className = "fas fa-pause-circle";
}

function playNextTrack(){
    if (trackIndex < trackList.length){
        trackIndex++;
    } else {
        trackIndex = 0;
    }

    // This a workaround for when soundcloud widget hasn't loaded in the sound file yet
    // Repeater constantly attempts playback, and stops repeating attempts once sound has loaded begins playing
    let repeater = setInterval(() => {
        widget.skip(trackList[trackIndex]);
        widget.isPaused((paused)=>{
            if (!paused){
                clearInterval(repeater);
            }
        });
    }, 500);
    playToggle.childNodes[0].className = "fas fa-pause-circle";
}

function shuffleTracks(){
    for(let i = trackList.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * i)
        let temp = trackList[i]
        trackList[i] = trackList[j]
        trackList[j] = temp
      }
    trackIndex = 0;
}

//
// Inits & Event Listeners
//
playToggle.addEventListener("click", () => {playTrack();});
playPrev.addEventListener("click", () => {playPrevTrack();});
playNext.addEventListener("click", () => {playNextTrack();});
shuffle.addEventListener("click", () => {shuffleTracks();});

volumeSlider.addEventListener("input", () => {
    widget.setVolume(volumeSlider.value);
    if (volumeSlider.value == 0){
        volumeIcon.childNodes[0].className = "fas fa-volume-off";
    } else if (volumeSlider.value > 70){
        volumeIcon.childNodes[0].className = "fas fa-volume-up";
    } else {
        volumeIcon.childNodes[0].className = "fas fa-volume-down";
    }
});

seekSlider.addEventListener("input", () => {
    widget.seekTo(seekSlider.value);
})


    // Initialize tracklist as an array of integers for use with soundcloud api calls for playback
widget.bind(SC.Widget.Events.READY, () => {
    widget.getSounds(list => {
        console.log(list.length);
        for (let i = 0; i < list.length; i++){
            trackList.push(i);
        }
        console.log(trackList);
    })
});

    // Update track data whenever a new song begins
widget.bind(SC.Widget.Events.READY, () => {
    widget.bind(SC.Widget.Events.PLAY, () => {
        widget.getCurrentSound(currentSound => {
        artwork.src = currentSound.artwork_url;
        title.textContent = currentSound.title;
        artist.textContent = currentSound.user.username;
        title.setAttribute("href", currentSound.permalink_url);
        artist.setAttribute("href", currentSound.user.permalink_url);
        seekTextMax.textContent = convertSongTime(currentSound.duration);
        });
    });
    });

    // Update seekerbar text value & movement while the track is playing
widget.bind(SC.Widget.Events.PLAY_PROGRESS, () => {
    widget.getPosition(position => {
        widget.getDuration(duration => {
        seekSlider.max = duration;
        seekSlider.value = position;
        seekText.textContent = convertSongTime(position);
        });
    });
    })

    // Play next track once a track finishes
widget.bind(SC.Widget.Events.FINISH, () => {
    playNextTrack();
});
