
  let widgetIframe = document.getElementById('sc-widget');
  let widget = SC.Widget(widgetIframe);

  document.getElementById("play-pause").addEventListener("click", function(){
    widget.toggle();
  });

  document.getElementById("prev").addEventListener("click", function(){
    widget.prev();
  });

  document.getElementById("next").addEventListener("click", function(){
    widget.next();
  });