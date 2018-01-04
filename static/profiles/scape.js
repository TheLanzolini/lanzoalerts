var PROFILE = 'scape'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');
var QUEUE_INTERVAL_TIME = 30000;

if(location.search == '?test'){
  QUEUE_INTERVAL_TIME = 1000;
  var QUEUE = [
    { type: 'cheer', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" }, userstate: { bits: 100 } } }
    // { type: 'follow', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    // { type: 'resub', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } },
    // { type: 'subscription', data: { user: { display_name: "TheLanzolini", name: "thelanzolini" } } }
  ]
} else {
  var QUEUE = [];
}

var $notification, $sound;
var descriptionMap = {
  follow: 'New Follower!',
  subscription: 'New Subscriber!',
  resub: 'New Resub!',
  cheer: 'Cheered %b!'
}

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');

  $sound = document.createElement('audio');
  $sound.src = '/sounds/scape/scape.mp3';
  $sound.volume = 0.25;

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Slabo+27px";
  document.head.appendChild(link);

  var socket = io(`/${ROOM}`);
  socket.on('init', function(data){
    console.log(data);
  });
  socket.on('subscription', function(data){
    console.log(data);
    // QUEUE.push({ type: 'follow', data });
  });
  socket.on('resub', function(data){
    console.log(data);
    // QUEUE.push({ type: 'resub', data });
  });
  socket.on('follow', function(data){
    console.log('follow', data);
    QUEUE.push({ type: 'follow', data });
  });
  socket.on('cheer', function(data){
    console.log('cheer', data);
    // QUEUE.push({ type: 'cheer', data });
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
  $sound.play();
  var $notificationBody = document.createElement('div');
  $notificationBody.classList.add('notification-body');
  for (let i=0; i < 40; i++) {
    let $gnome = document.createElement('div');
    $gnome.classList.add('gnome');

    setTimeout(function(){
      $gnome.style.transform = 'translateY(5%)';
    }, (i + 1) * 75);

    setTimeout(function(){
      $gnome.style.animationName = 'gnome';
      $gnome.style.animationDelay = (i * 0.1) + 's';
    }, ((i + 1) * 100) + 500);

    $gnome.style.left = (i * 80) + 'px';
    $notificationBody.appendChild($gnome);
  }

  var $text = document.createElement('div');
  $text.classList.add('text');
  var $name = document.createElement('div');
  $name.classList.add('name');
  var $isBuying = document.createElement('img');
  $name.textContent = notification.data.user.display_name;
  $isBuying.src = '/images/scape/is-buying-gf.png';
  $text.appendChild($name);
  $text.appendChild($isBuying);
  $notificationBody.appendChild($text);

  $notification.appendChild($notificationBody);

  setTimeout(function(){
    $notification.innerHTML = '';
  }, 26000);
}
