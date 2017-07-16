var ROOM = 'thelanzolini'
var QUEUE_INTERVAL_TIME = 20000;

if(location.search == '?test'){
  var QUEUE = [
    { type: 'follow', data: { user: { display_name: "ThePoridgeater", name: "theporidgeater" } } },
    { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    { type: 'follow', data: { user: { display_name: "Afeonim", name: "afeonim" } } },
    { type: 'follow', data: { user: { display_name: "Coreyshift", name: "coreyshift" } } }
  ]
} else {
  var QUEUE = [];
}

var $notification, $walkingInTheReallyLate80s, $explosionAudio, $KameHameHa;

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');

  $walkingInTheReallyLate80s = document.createElement('audio');
  $walkingInTheReallyLate80s.src = '/sounds/thelanzolini/walking_in_the_really_late_80s.mp3';
  $walkingInTheReallyLate80s.volume = 0.5;

  $explosionAudio = document.createElement('audio');
  $explosionAudio.src = '/sounds/thelanzolini/explosion.mp3';
  $explosionAudio.volume = 0.5;

  $KameHameHa = document.createElement('audio');
  $KameHameHa.src = '/sounds/thelanzolini/kame_hame_ha.mp3';
  $KameHameHa.volume = 1.0;

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Bungee";
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
  }, QUEUE_INTERVAL_TIME);
});

function notify(notification) {
  var $notificationBody = document.createElement('div');
  $notificationBody.classList.add('notification-body');
  $notification.appendChild($notificationBody);
  $notificationBody.classList.add('start');
  $walkingInTheReallyLate80s.play();
  $KameHameHa.play();
  var $explosion = document.createElement('img');
  $explosion.src = '/images/explosion.gif';
  $explosion.classList.add('explosion');

  var $userName = document.createElement('div');
  $userName.classList.add('user-name');
  var $userText = document.createElement('div');
  $userText.classList.add('text');
  $userText.textContent = notification.data.user.display_name;
  var $userDescription = document.createElement('div');
  $userDescription.classList.add('description');
  $userDescription.textContent = 'New Follower';
  $userName.appendChild($userText);
  $userName.appendChild($userDescription);


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
