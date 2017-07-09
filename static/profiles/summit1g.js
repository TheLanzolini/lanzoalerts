var ROOM = 'summit1g'
// var QUEUE = [
//   { type: 'subscription', data: { username: 'Adsasds18', message: 'asdasdasd asdasd asd' } },
//   { type: 'resub', data: { username: 'Poridgeater', message: 'asdasdasd asdasd asd', months: 2 } },
//   { type: 'cheer', data: { username: 'TheLanzolini', message: 'Cheer100 :)' } }
// ];
var QUEUE = [];
var $notification, $discordAudio, $harmonyAudio, $subscriptionAudio, notificationTypeAudios = {};

window.addEventListener('DOMContentLoaded', function(){

  $discordAudio = document.createElement('audio');
  $discordAudio.src = '/sounds/zenyatta/discord.ogg';
  $discordAudio.volume = 0.5;
  $harmonyAudio = document.createElement('audio');
  $harmonyAudio.src = '/sounds/zenyatta/harmony.ogg';
  $harmonyAudio.volume = 0.5;
  $subscriptionAudio = document.createElement('audio');
  $subscriptionAudio.src = '/sounds/zenyatta/subscription.ogg';
  $subscriptionAudio.volume = 0.5;
  $resubAudio = document.createElement('audio');
  $resubAudio.src = '/sounds/zenyatta/resub.ogg';
  $resubAudio.volume = 0.5;
  $cheerAudio = document.createElement('audio');
  $cheerAudio.src = '/sounds/zenyatta/cheer.ogg';
  $cheerAudio.volume = 0.5;

  notificationTypeAudios = {
    'subscription': $subscriptionAudio,
    'resub': $resubAudio,
    'cheer': $cheerAudio
  }

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Bungee";
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

  var queueInterval = setInterval(function(){
    var notification = QUEUE.shift();
    if(notification) {
      switch(notification.type) {
        case 'subscription':
          subNotification(notification);
          break;
        case 'resub':
          subNotification(notification);
          break;
        case 'cheer':
          subNotification(notification);
          break;
        default:
          break;
      }
    }
  }, 10000);

});

function subNotification (notification) {
  console.log(notification);

  $discordAudio.play();
  setTimeout(function(){
    $harmonyAudio.play()
  }, 1000);
  setTimeout(function(){
    notificationTypeAudios[notification.type].play();
  }, 2000);

  var $purpleTextWrapper = document.createElement('div');
  $purpleTextWrapper.classList.add('purple-text-wrapper');
  var $purpleTextName = document.createElement('div');
  $purpleTextName.classList.add('purple-text-name');

  var chars = (notification.data.username || notification.data.userstate['display-name']).split('');
  var charSpans = []
  chars.forEach(function(char, index){
    var charSpan = document.createElement('span');
    var delay = (index * 0.1);
    charSpan.style.animationDelay = `${delay}s`;
    charSpans.push(charSpan);
    charSpan.classList.add('name-char');
    charSpan.innerText = char;
    $purpleTextName.appendChild(charSpan);
    var halfDone = (delay + 0.5) * 1000;
    setTimeout(function(){ charSpan.classList.add('half-done'); }, halfDone);
  });
  charSpans.reverse().forEach(function(charSpan, index){
    var delay = (1 + (index * 0.05)) * 1000;
    setTimeout(function(){
      charSpan.classList.add('done');
    }, delay);
  });

  var doneTime = (1 + (charSpans.length * 0.05)) * 1000;

  $purpleTextWrapper.appendChild($purpleTextName);

  $discordOrb = document.createElement('div');
  $discordInner = document.createElement('div');
  $discordInner.classList.add('discord-inner');
  $discordOrb.classList.add('discord-orb');
  $discordOrb.appendChild($discordInner);

  $harmonyOrb = document.createElement('div');
  $harmonyInner = document.createElement('div');
  $harmonyInner.classList.add('harmony-inner');
  $harmonyOrb.classList.add('harmony-orb');
  $harmonyOrb.appendChild($harmonyInner);

  $notification.appendChild($discordOrb);
  $notification.appendChild($harmonyOrb);

  var $description = document.createElement('div');
  $description.classList.add('description');
  $description.innerText = notification.type == 'subscription' ? 'New Subscription!' : notification.type == 'resub' ? `${notification.data.months} months!` : notification.type == 'cheer' ? `${notification.data.userstate.bits} Bits!` : '';
  $description.style.animationDelay = `${doneTime/1000}s`;
  setTimeout(function(){
    $description.classList.add('done');
  }, (doneTime + 1000))

  var $message = document.createElement('div');
  $message.classList.add('message');
  $message.innerText = notification.data.message ? notification.data.message : '';

  $notification.appendChild($purpleTextWrapper);
  $notification.appendChild($description);
  $notification.appendChild($message);
  setTimeout(function(){
    $notification.innerHTML = '';
  }, 8000);

}
