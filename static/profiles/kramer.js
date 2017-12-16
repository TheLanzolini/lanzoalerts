var ROOM = 'joshog';
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  // QUEUE_INTERVAL_TIME = 1000;
  var QUEUE = [
    { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    { type: 'cheer', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" }, userstate: { bits: 100 } } },
    { type: 'resub', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    { type: 'subscription', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } }
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
  var $notificationBody = document.createElement('div');
  $notificationBody.classList.add('notification-body');
  $notification.appendChild($notificationBody);
  $notificationBody.classList.add('start');

  $theme.play();

  var $sein = document.createElement('div');
  $sein.classList.add('sein');
  var $seinText = document.createElement('div');
  $seinText.classList.add('sein-text');
  //
  $seinText.textContent = 'TheLanzolini';
  $sein.appendChild($seinText);

  var $user = document.createElement('div');
  $user.classList.add('user');

  var $description = document.createElement('div');
  $description.classList.add('description');
  //
  var description = descriptionMap[notification.type].replace('%b', (notification.data.userstate || {bits: ''}).bits)
  $description.textContent = description;

  var $name = document.createElement('div');
  $name.classList.add('user-name');
  $name.textContent = (notification.data.user || notification.data.userstate).display_name;

  $user.appendChild($description);
  $user.appendChild($name);

  var $kramerWrapper = document.createElement('div');
  $kramerWrapper.classList.add('kramer-wrapper');

  (['kramer', 'jerry', 'george', 'elaine']).forEach(function(member){
    var $gif = document.createElement('img');
    $gif.src = `/images/kramer/${member}.gif`;
    $gif.classList.add('gif');
    $kramerWrapper.appendChild($gif);
  });

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
