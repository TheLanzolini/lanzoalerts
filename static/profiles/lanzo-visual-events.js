var PROFILE = 'lanzo-visual-commands';
var ROOM = 'lanzo';
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  var QUEUE = [
    '!praise',
    '!jacked'
  ]
} else {
  var QUEUE = [];
}

function video(name) {
  var $video = document.createElement('video');
  $video.src = '/videos/'+ name +'.mp4';
  $video.setAttribute('autoplay', true);
  document.body.appendChild($video);
  $video.addEventListener('ended', function(){
    document.body.removeChild($video);
  });
}

function jacked() {
  video('jacked');
}

function praise() {
  video('praise');
}

var commands = {
  '!jacked': jacked,
  '!praise': praise
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
