var PROFILE = 'hammer'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  QUEUE_INTERVAL_TIME = 1000;
  var QUEUE = [
    { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } }
    // { type: 'cheer', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" }, userstate: { bits: 100 } } },
    // { type: 'resub', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    // { type: 'subscription', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } }
  ]
} else {
  var QUEUE = [];
}

var $notification, $theme;
var descriptionMap = {
  follow: 'New Follower',
  subscription: 'New Subscriber',
  resub: 'Executive Subscriber',
  cheer: 'Brought to you with %b Bits'
}

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');
  // $theme = document.createElement('audio');
  // $theme.src = '/sounds/kramer/seinfeld.mp3';
  // $theme.volume = 0.5;

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
    QUEUE.push({ type: 'resub', data });
  });
  socket.on('follow', function(data){
    console.log('follow', data);
    QUEUE.push({ type: 'follow', data });
  });
  socket.on('cheer', function(data){
    console.log('cheer', data);
    QUEUE.push({ type: 'cheer', data });
  });

  var queueInterval = setInterval(function(){
    var notification = QUEUE.shift();
    if (notification) {
      notify(notification);
    }
  }, QUEUE_INTERVAL_TIME);
});

function notify(notification) {
  console.log(notification);
  var $notificationBody = document.createElement('div');

  var mjolnir1 = document.createElement('img');
  mjolnir1.src = '/images/hammer/mjolnir.png';
  mjolnir1.classList.add('mjolnir1', 'mjolnir');
  var mjolnir2 = document.createElement('img');
  mjolnir2.src = '/images/hammer/mjolnir.png';
  mjolnir2.classList.add('mjolnir2', 'mjolnir');

  $notificationBody.appendChild(mjolnir1);
  $notificationBody.appendChild(mjolnir2);

  $notification.appendChild($notificationBody);

}
