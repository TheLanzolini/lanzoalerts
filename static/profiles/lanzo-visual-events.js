var PROFILE = 'lanzo-visual-commands';
var ROOM = 'lanzo';
var QUEUE_INTERVAL_TIME = 5000;

if(location.search == '?test'){
  var QUEUE = [
    '!jacked'
  ]
} else {
  var QUEUE = [];
}

function jacked() {
  var $jacked = document.createElement('video');
  $jacked.src = '/videos/jacked.mp4';
  $jacked.setAttribute('autoplay', true);
  document.body.appendChild($jacked);
  $jacked.addEventListener('ended', function(){
    setTimeout(function(){
      document.body.removeChild($jacked);
    }, 200);
  });
}

var commands = {
  '!jacked': jacked
}

window.addEventListener('DOMContentLoaded', function(){
  var socket = io(`/${ROOM}`);

  socket.on('command', function(data) {
    console.log(data);
    QUEUE.push(data.command);
  });

  var queueInterval = setInterval(function(){
    var command = QUEUE.shift();
    if (command && !!commands[command]) {
      commands[command]();
    }
  }, QUEUE_INTERVAL_TIME);

});
