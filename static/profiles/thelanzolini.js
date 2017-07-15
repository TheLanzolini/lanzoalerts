var ROOM = 'thelanzolini'

var QUEUE = [];
var $notification, $walkingInTheReallyLate80s, $explosionAudio;

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');

  $walkingInTheReallyLate80s = document.createElement('audio');
  $walkingInTheReallyLate80s.src = '/sounds/thelanzolini/walking_in_the_really_late_80s.mp3';
  $walkingInTheReallyLate80s.volume = 0.5;

  $explosionAudio = document.createElement('audio');
  $explosionAudio.src = '/sounds/thelanzolini/explosion.mp3';
  $explosionAudio.volume = 0.5;

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Audiowide";
  document.head.appendChild(link);

  var socket = io(`/${ROOM}`);
  socket.on('init', function(data){
    console.log(data);
  });
  socket.on('subscription', function(data){
    console.log(data);
  });
  socket.on('resub', function(data){
    console.log(data);
  });
  socket.on('follow', function(data){
    console.log('follow', data);
    QUEUE.push({ type: 'follow', data });
  });

  var queueInterval = setInterval(function(){
    var notification = QUEUE.shift();
    if(notification) {
      switch(notification.type) {
        case 'follow':
          notify(notification);
          break;
        default:
          break;
      }
    }
  }, 10000);
});

function notify(notification) {
  var $notificationBody = document.createElement('div');
  $notificationBody.classList.add('notification-body');
  $notification.appendChild($notificationBody);
  $notificationBody.classList.add('start');
  $walkingInTheReallyLate80s.play();
  var $explosion = document.createElement('img');
  $explosion.src = '/images/explosion.gif';
  $explosion.classList.add('explosion');

  var $userName = document.createElement('div');
  $userName.classList.add('user-name');
  $userName.textContent = notification.data.user.display_name + ' has followed!';


  setTimeout(function(){
    $notificationBody.appendChild($explosion);
    $explosionAudio.play();
  }, 3000);
  setTimeout(function(){
    $explosion.classList.add('fade');
    $notificationBody.appendChild($userName);
  }, 3500);
  setTimeout(function(){
    $notificationBody.removeChild($explosion);
  }, 4000);
  setTimeout(function(){
    $notification.innerHTML = '';
  }, 9000);

}
