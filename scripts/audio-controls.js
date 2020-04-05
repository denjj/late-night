"use strict";

// Initialize iframe SC Widget
let widgetIframe = document.getElementById('sc-widget');
let widget = SC.Widget(widgetIframe);

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
var slider = document.getElementById("volumeSlider");
var output = document.getElementById("volumeVal");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
  widget.setVolume(this.value);
}

// Track Seeker