var PROFILE = 'lanzo-visual-commands';
var ROOM = 'lanzo';
var running = false;
var $notification, $sweetvictory;

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
    $video.volume = 0.8;
    $notification.appendChild($video);
    $video.addEventListener('ended', function(){
      $notification.removeChild($video);
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

function sweetvictory() {
  return new Promise(function(resolve, reject) {
    var $spongeBody = document.createElement('div');
    $spongeBody.classList.add('sponge-body');
    $notification.appendChild($spongeBody);

    var members = ['krabs', 'patrick', 'sandy', 'spongebob'];
    members.forEach(function(member){
      var iWrap = document.createElement('div');
      iWrap.classList.add('rockstar-wrap', `${member}-wrap`);
      var i = document.createElement('img');
      i.src = `/images/sweet_victory/${member}.jpg`;
      i.classList.add(member, 'rockstar');
      iWrap.appendChild(i)
      $spongeBody.appendChild(iWrap);
    });

    var fans = document.createElement('img');
    fans.classList.add('fans');
    fans.src = '/images/sweet_victory/giphy.gif';

    $spongeBody.appendChild(fans);

    $sweetVictory.play();

    setTimeout(function(){
      $notification.innerHTML = '';
      resolve();
    }, 9000);
  });
}

var commands = {
  '!jacked': jacked,
  '!praise': praise,
  '!theway': theway,
  '!sweetvictory': sweetvictory
}

window.addEventListener('DOMContentLoaded', function(){
  var socket = io(`/${ROOM}`);
  $sweetVictory = document.createElement('audio');
  $sweetVictory.src = '/sounds/thelanzolini/sweet_victory.mp3';
  $sweetVictory.volume = 0.5;
  $notification = document.getElementById('notification');
  socket.on('command', function(data) {
    console.log(data);
    if (commands[data.command]) {
      addToQueue(commands[data.command]);
    }
  });

});
