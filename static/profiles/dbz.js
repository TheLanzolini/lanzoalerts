var PROFILE = 'dbz'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');
if(location.search == '?test'){
  var QUEUE = [
    { type: 'follow', data: { user: { display_name: "ThePoridgeater", name: "theporidgeater" } } },
    { type: 'cheer', data: { username: 'Lanzo', userstate: { bits: 100 }, message: 'Cheer100 :) I just cheered!' } },
    { type: 'resub', data: { username: 'Lanzo', message: 'I just resubbed, and this is my message :)', months: 2 } },
    { type: 'subscription', data: { username: 'Lanzo', message: '' } }
  ];
}else{
  var QUEUE = [];
}
var $notification, $audio, $transmission;

window.addEventListener('DOMContentLoaded', function(){

  $audio = document.createElement('audio');
  $audio.src = '/sounds/dbz/dbz.mp3';
  $audio.volume = 0.15;

  $transmission = document.createElement('audio');
  $transmission.src = '/sounds/dbz/instant_transmission.mp3';
  $transmission.volume = 0.15;

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Luckiest+Guy";
  document.head.appendChild(link);

  $notification = document.getElementById('notification');

  var socket = io(`/${ROOM}`);
  socket.on('subscription', function(data){
    console.log('subscription', data);
    QUEUE.push({ type: 'subscription', data });
  });
  socket.on('resub', function(data){
    console.log('resub', data);
    QUEUE.push({ type: 'resub', data });
  });
  socket.on('cheer', function(data){
    console.log('cheer', data);
    QUEUE.push({ type: 'cheer', data });
  });
  socket.on('follow', function(data){
    console.log('follow', data);
    QUEUE.push({ type: 'follow', data });
  });

  var queueInterval = setInterval(function(){
    var notification = QUEUE.shift();
    if(notification) {
      subNotification(notification);
    }
  }, 20000);

});

function subNotification (notification) {
  console.log(notification);

  $audio.play();

  var descriptions = {
    'subscription': `Subscribed!`,
    'cheer': `${notification.data.userstate && notification.data.userstate.bits ? notification.data.userstate.bits : ''} Bits!`,
    'resub': `Resubbed!`,
    'follow': `Followed!`
  }

  var $notificationBody = document.createElement('div');
  $notificationBody.classList.add('notification-body');

  var $goku = document.createElement('img');
  $goku.src = 'https://fsmedia.imgix.net/8e/37/3b/05/c5ea/4f4e/96df/1bf9b54f1a4d/goku.gif?rect=0%2C8%2C588%2C294&auto=format%2Ccompress&w=588&gifq=35';
  $goku.classList.add('goku', 'slide');

  var $vegeta = document.createElement('img');
  $vegeta.src = 'https://pa1.narvii.com/6511/5a1cfe109993e48c7099005f148e865214b9b67a_hq.gif';
  $vegeta.classList.add('vegeta', 'slide');

  var $gohan = document.createElement('img');
  $gohan.src = 'https://media.tenor.com/images/ccd12bb1a8c52e5263cb1bcc967f408c/tenor.gif';
  $gohan.classList.add('gohan', 'slide');

  var $trunks = document.createElement('img');
  $trunks.src = 'https://78.media.tumblr.com/cc10a751969d7233af5762afcb975c9e/tumblr_of7hzdEurK1rqe0rbo1_500.gif';
  $trunks.classList.add('trunks', 'slide');

  var $notificationBox = document.createElement('div');
  $notificationBox.classList.add('notification-box');

  var $notificationUser = document.createElement('div');
  $notificationUser.classList.add('notification-user');
  $notificationUser.textContent = notification.data.userstate && notification.data.userstate.username ? notification.data.userstate.username : notification.data.user && notification.data.user.display_name ? notification.data.user.display_name : notification.data.username;

  var $notificationDescription = document.createElement('div');
  $notificationDescription.classList.add('notification-description');
  $notificationDescription.textContent = descriptions[notification.type];

  var $notificationMessage = document.createElement('div');
  $notificationMessage.classList.add('notification-message');
  $notificationMessage.textContent = notification.data.message;

  $notificationBox.appendChild($notificationUser);
  $notificationBox.appendChild($notificationDescription);
  $notificationBox.appendChild($notificationMessage);

  $notificationBody.appendChild($goku);
  $notificationBody.appendChild($vegeta);
  $notificationBody.appendChild($gohan);
  $notificationBody.appendChild($trunks);
  $notificationBody.appendChild($notificationBox);

  $notification.appendChild($notificationBody);

  setTimeout(function() {
    $transmission.play();
  }, 14000)

  setTimeout(function(){
    $notification.innerHTML = '';
  }, 15000);

}
