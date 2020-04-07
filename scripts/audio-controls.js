"use strict";

// Initialize iframe SC Widget
let widgetIframe = document.getElementById('sc-widget');
let widget = SC.Widget(widgetIframe);
widgetIframe.style.display = "none";

// Add Event listeners for media buttons
document.getElementById("play-pause").addEventListener("click", function(){
  widget.toggle();
});

document.getElementById("prev").addEventListener("click", function(){
  widget.prev();
});

document.getElementById("next").addEventListener("click", function(){
  widget.next();
});

// Volume Slider
var volumeSlider = document.getElementById("volumeSlider");
var volumeVal = document.getElementById("volumeVal");
volumeVal.innerHTML = volumeSlider.value;

volumeSlider.oninput = function() {
  volumeVal.innerHTML = this.value;
  widget.setVolume(this.value);
}

// Track Seeker
var seekSlider = document.getElementById("seekSlider");
var seekVal = document.getElementById("seekVal");
seekVal.innerHTML = seekSlider.value;

seekSlider.oninput = function() {
  seekVal.innerHTML = this.value;
  widget.seekTo(this.value);
}

// Track Movement
widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(){
  widget.getPosition(function(position){
    let slide = document.getElementById("seekSlider");
    widget.getDuration(function(trackLength) {
      let slideMax = document.getElementById("seekSlider");
      slideMax.max = trackLength;
    });
    slide.value = position;
  });
})

let title = document.getElementById("title");
let artist = document.getElementById("artist");
let artwork = document.getElementById("artwork");

widget.bind(SC.Widget.Events.READY, function() {
  widget.bind(SC.Widget.Events.PLAY, function() {
    // get information about currently playing sound
    widget.getCurrentSound(function(currentSound) {
      console.log(currentSound);
      console.log(currentSound.user.username);
      console.log(currentSound.title);
      console.log(currentSound.artwork_url);

      document.getElementById("artist").textContent = currentSound.user.username;
      document.getElementById("title").textContent = currentSound.title;
      document.getElementById("artwork").src = currentSound.artwork_url;

    });
  });
});
