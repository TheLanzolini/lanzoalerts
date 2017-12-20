var PROFILE = 'sweetvictory'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');
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

  $sweetVictory = document.createElement('audio');
  $sweetVictory.src = '/sounds/thelanzolini/sweet_victory.mp3';
  $sweetVictory.volume = 0.5;

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

  socket.on('!victory', function(data){
    spongeNotify();
  });

  var queueInterval = setInterval(function(){
    var notification = QUEUE.shift();
    if(notification) {
      switch(notification.type) {
        case 'follow':
          spongeNotify(notification);
          break;
        default:
          break;
      }
    }
  }, QUEUE_INTERVAL_TIME);
});

function spongeNotify() {
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
  }, 9000);

}
