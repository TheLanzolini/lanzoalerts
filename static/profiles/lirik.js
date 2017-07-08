var ROOM = 'lirik'
var QUEUE = [{ type: 'subscription', data: { username: 'Adsasds18', message: 'asdasdasd asdasd asd' } }];
// var QUEUE = [];
var $notification;

window.addEventListener('DOMContentLoaded', function(){

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
    console.log(QUEUE);
    var notification = QUEUE.reverse().pop();
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

  var $purpleTextWrapper = document.createElement('div');
  $purpleTextWrapper.classList.add('purple-text-wrapper');
  var $purpleTextOverlay = document.createElement('div');
  $purpleTextOverlay.classList.add('purple-text-overlay');
  var $purpleTextName = document.createElement('div');
  $purpleTextName.classList.add('purple-text-name');

  var chars = (notification.data.username || notification.data.userstate['display-name']).split('');
  var charSpans = []
  chars.forEach(function(char, index){
    var charSpan = document.createElement('span');
    charSpans.push(charSpan);
    charSpan.classList.add('name-char');
    charSpan.innerText = char;
    $purpleTextName.appendChild(charSpan);
  });
  charSpans.reverse().forEach(function(charSpan, index){
    var delay = (1 + (index * 0.05)) * 1000;
    setTimeout(function(){
      charSpan.classList.add('done');
    }, delay);
  });

  var doneTime = (1 + (charSpans.length * 0.05)) * 1000;

  $purpleTextWrapper.appendChild($purpleTextOverlay);
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
  $description.innerText = notification.type == 'subscription' ? 'New Subscription!' : notification.type == 'resub' ? `${notification.data.months} months!` : notification.type == 'cheer' ? '100 Bits!' : '';
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
