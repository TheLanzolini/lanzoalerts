var PROFILE = 'lanzo-visual-commands';
var ROOM = 'lanzo';
var running = false;

if(location.search == '?test'){
  var QUEUE = [
    '!praise',
    '!jacked'
  ]
} else {
  var QUEUE = [];
}

function next() {
  if(QUEUE[0]) {
    running = true;
    const promise = QUEUE.shift();
    promise().then(function(){
      console.log('2000 buffer');
      setTimeout(next, 2000);
    });
  } else {
    running = false;
  }
}

function addToQueue(promise) {
  QUEUE.push(promise);
  if (!running) {
    next();
  }
}

function video(name) {
  return new Promise(function(resolve, reject) {
    var $video = document.createElement('video');
    $video.src = '/videos/'+ name +'.mp4';
    $video.setAttribute('autoplay', true);
    document.body.appendChild($video);
    $video.addEventListener('ended', function(){
      document.body.removeChild($video);
      return resolve();
    });
  });
}

function jacked() {
  return video('jacked');
}

function praise() {
  return video('praise');
}

function theway() {
  return video('theway');
}

var commands = {
  '!jacked': jacked,
  '!praise': praise,
  '!theway': theway
}

window.addEventListener('DOMContentLoaded', function(){
  var socket = io(`/${ROOM}`);

  socket.on('command', function(data) {
    console.log(data);
    if (commands[data.command]) {
      addToQueue(commands[data.command]);
    }
  });

});
