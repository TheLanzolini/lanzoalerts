var PROFILE = 'hammer'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  QUEUE_INTERVAL_TIME = 1000;
  var QUEUE = [
    { type: 'cheer', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" }, userstate: { bits: 100 } } },
    { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    { type: 'resub', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    { type: 'subscription', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } }
  ]
} else {
  var QUEUE = [];
}

var $notification, $theme;
var descriptionMap = {
  follow: 'New Follower!',
  subscription: 'New Subscriber!',
  resub: 'New Resub!',
  cheer: 'Cheered %b!'
}

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');
  $sound = document.createElement('audio');
  $sound.src = '/sounds/hammer/sonicboom.mp3';
  $sound.volume = 0.5;

  $hammerSound = document.createElement('audio');
  $hammerSound.src = '/sounds/hammer/hammer.mp3';
  $hammerSound.volume = 0.5;

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
  var $explosion = document.createElement('img');
  $explosion.src = '/images/explosion.gif';
  $explosion.classList.add('explosion');
  $sound.play();
  $hammerSound.play();

  var mjolnir1 = document.createElement('img');
  mjolnir1.src = '/images/hammer/mjolnir.png';
  mjolnir1.classList.add('mjolnir1', 'mjolnir');
  var mjolnir2 = document.createElement('img');
  mjolnir2.src = '/images/hammer/mjolnir.png';
  mjolnir2.classList.add('mjolnir2', 'mjolnir');

  $notificationBody.appendChild(mjolnir1);
  $notificationBody.appendChild(mjolnir2);

  var $notificationTextWrapper = document.createElement('div');
  var $notificationTextLabel = document.createElement('div');
  var $notificationTextValue = document.createElement('div');

  $notificationTextLabel.textContent = descriptionMap[notification.type].replace('%b', (notification.data.userstate || {bits: ''}).bits)
  $notificationTextValue.textContent = notification.data.user.display_name;

  $notificationTextWrapper.appendChild($notificationTextLabel);
  $notificationTextWrapper.appendChild($notificationTextValue);
  $notificationTextWrapper.classList.add('notification-text');

  $notification.appendChild($notificationBody);

  setTimeout(function(){
    $notificationBody.appendChild($explosion);
    $notification.appendChild($notificationTextWrapper);
  }, 2100);

  setTimeout(function(){
    $notificationTextWrapper.classList.add('fade');
  }, 2800);

  setTimeout(function(){
    $explosion.classList.add('fade');
  }, 2800);


  setTimeout(function(){
    $notificationTextWrapper.classList.remove('fade');
  }, 20000);

  setTimeout(function(){
    $notification.innerHTML = '';
  }, 26000);
}
