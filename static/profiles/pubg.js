var ROOM = 'thelanzolini';
var QUEUE_INTERVAL_TIME = 10000;

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

var $notification, $walkingInTheReallyLate80s, $explosionAudio, $KameHameHa, $panSound, $pubgTheme, $sweetVictory;

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');

  $panSound = document.createElement('audio');
  $panSound.src = '/sounds/thelanzolini/pan.mp3';
  $panSound.volume = 0.25;

  $pubgTheme = document.createElement('audio');
  $pubgTheme.src = '/sounds/thelanzolini/pubgtheme1.mp3';
  $pubgTheme.volume = 0.5;

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Bungee|Teko";
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
          pubgNotify(notification);
          break;
        default:
          break;
      }
    }
  }, QUEUE_INTERVAL_TIME);
});

function pubgNotify(notification){
  $pubgTheme.play();
  var $pubgBody = document.createElement('div');
  $pubgBody.classList.add('pubg-body');
  var $pubgWrapper = document.createElement('div');
  $pubgWrapper.classList.add('pubg-wrapper');
  $pubgWrapper.appendChild($pubgBody)

  $notification.appendChild($pubgWrapper);

  var $pan = document.createElement('img');
  $pan.src = '/images/pan.png';
  $pan.classList.add('pubg-pan');
  $pubgBody.appendChild($pan);

  var $blood = document.createElement('img');
  $blood.src = '/images/blood.png';
  $blood.classList.add('pubg-blood');
  $pubgBody.appendChild($blood);

  var $notificationText = document.createElement('div');
  $notificationText.classList.add('pubg-text')
  var $userName = document.createElement('div');
  $userName.textContent = notification.data.user.display_name;
  var $desc = document.createElement('div');
  $desc.textContent = 'New Follower';
  $notificationText.appendChild($desc);
  $notificationText.appendChild($userName);
  $pubgBody.appendChild($notificationText);

  setTimeout(function(){
    $panSound.play();
  }, 150);

  setTimeout(function(){
    $pubgBody.classList.add('done');
  }, 8500);

  setTimeout(function(){
    $notification.innerHTML = '';
  }, 9000);
}
