var ROOM = 'thelanzolini';
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  QUEUE_INTERVAL_TIME = 1000;
  var QUEUE = [
    { type: 'follow', data: { user: { display_name: "ThePoridgeater", name: "theporidgeater" } } },
    // { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    // { type: 'follow', data: { user: { display_name: "Afeonim", name: "afeonim" } } },
    // { type: 'follow', data: { user: { display_name: "Coreyshift", name: "coreyshift" } } }
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

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Open+Sans";
  document.head.appendChild(link);

  var socket = io(`/${ROOM}`);
  socket.on('init', function(data){
    console.log(data);
  });
  socket.on('subscription', function(data){
    console.log(data);
    QUEUE.push({ type: 'follow', data });
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

  var $sein = document.createElement('div');
  $sein.classList.add('sein');
  var $seinText = document.createElement('div');
  $seinText.classList.add('sein-text');
  // $seinText.textContent = notification.data.user.display_name;
  $seinText.textContent = 'TheLanzolini';
  $sein.appendChild($seinText);

  var $user = document.createElement('div');
  $user.classList.add('user');

  var $description = document.createElement('div');
  $description.classList.add('description');
  $description.textContent = 'New Follower';

  var $name = document.createElement('div');
  $name.classList.add('user-name');
  $name.textContent = notification.data.user.display_name;

  $user.appendChild($description);
  $user.appendChild($name);

  var $kramerWrapper = document.createElement('div');
  $kramerWrapper.classList.add('kramer-wrapper');

  var $kramer = document.createElement('img');
  $kramer.src = 'https://i.imgur.com/Z4kYED1.gif';

  $kramerWrapper.appendChild($kramer);

  $notification.appendChild($sein);
  $notification.appendChild($user);
  $notification.appendChild($kramerWrapper);

  setTimeout(function(){
    $notification.classList.add('show');
  }, 1000);


  setTimeout(function(){
    $notification.classList.remove('show');
  }, 25000);

  setTimeout(function(){
    $notification.innerHTML = '';
  }, 26000);
}
