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

  $walkingInTheReallyLate80s = document.createElement('audio');
  $walkingInTheReallyLate80s.src = '/sounds/thelanzolini/walking_in_the_really_late_80s.mp3';
  $walkingInTheReallyLate80s.volume = 0.5;

  $explosionAudio = document.createElement('audio');
  $explosionAudio.src = '/sounds/thelanzolini/explosion.mp3';
  $explosionAudio.volume = 0.5;

  $KameHameHa = document.createElement('audio');
  $KameHameHa.src = '/sounds/thelanzolini/kame_hame_ha.mp3';
  $KameHameHa.volume = 1.0;

  $panSound = document.createElement('audio');
  $panSound.src = '/sounds/thelanzolini/pan.mp3';
  $panSound.volume = 0.25;

  $pubgTheme = document.createElement('audio');
  $pubgTheme.src = '/sounds/thelanzolini/pubgtheme1.mp3';
  $pubgTheme.volume = 0.5;

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
          pubgNotify(notification);
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

function pubgNotify(notification){
  $pubgTheme.play();
  var $pubgBody = document.createElement('div');
  $pubgBody.classList.add('pubg-body');
  var $pubgWrapper = document.createElement('div');
  $pubgWrapper.classList.add('pubg-wrapper');
  $pubgWrapper.appendChild($pubgBody)

  $notification.appendChild($pubgWrapper);

  var $pan = document.createElement('img');
  $pan.src = 'images/pan.png';
  $pan.classList.add('pubg-pan');
  $pubgBody.appendChild($pan);

  var $blood = document.createElement('img');
  $blood.src = 'images/blood.png';
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
