var ROOM = 'thelanzolini';
var QUEUE_INTERVAL_TIME = 30000;

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

var $notification, $theme;

window.addEventListener('DOMContentLoaded', function(){
  console.log('asd')
  $notification = document.getElementById('notification');
  $theme = document.createElement('audio');
  $theme.src = '/sounds/kramer/seinfeld.mp3';
  $theme.volume = 0.5;

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
    console.log(notification);
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

  $theme.play();

  var $userName = document.createElement('div');
  $userName.classList.add('user-name');
  var $userText = document.createElement('div');
  $userText.classList.add('text');
  $userText.textContent = notification.data.user.display_name;
  $userName.appendChild($userText);

  var $userDescription = document.createElement('div');
  $userDescription.classList.add('description');
  $userDescription.textContent = 'New Follower';

  $notification.appendChild($userName);
  $notification.appendChild($userDescription);

  setTimeout(function(){
    $notification.classList.add('show');
  }, 1000);




  setTimeout(function(){
    $notification.innerHTML = '';
  }, 25000);
}
