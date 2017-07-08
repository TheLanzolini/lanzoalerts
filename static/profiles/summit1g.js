var ROOM = 'summit1g'
var QUEUE = [{ type: 'subscription', data: { username: 'Adsads18' } }];
var $notification;

window.addEventListener('DOMContentLoaded', function(){

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Black+Ops+One";
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

  // var queueInterval = setInterval(function(){
    var notification = QUEUE.pop();
    if(notification) {
      console.log(notification.type);

      switch(notification.type) {
        case 'subscription':
          subNotification(notification.data);
          break;
        case 'resub':
          subNotification(notification.data);
          break;
        case 'cheer':
          subNotification(notification.data);
          break;
        default:
          break;
      }

    }
  // }, 10000);

});

function subNotification (notification) {
  $notification.classList.toggle('hidden');

  var $purpleTextWrapper = document.createElement('div');
  $purpleTextWrapper.classList.add('purple-text-wrapper');
  var $purpleTextOverlay = document.createElement('div');
  $purpleTextOverlay.classList.add('purple-text-overlay');
  var $purpleTextName = document.createElement('div');
  $purpleTextName.classList.add('purple-text-name');

  var chars = notification.username.split('');
  chars.forEach(function(char, index){
    var charSpan = document.createElement('span');
    charSpan.classList.add('name-char');
    charSpan.innerText = char;
    // FIX TIMING OF THE ANIMATION delays
    // and then add a class to make it stay
    charSpan.style.animationDelay = `${(chars.length - index) - 0.25}s`;
    $purpleTextName.appendChild(charSpan);
  });

  $purpleTextWrapper.appendChild($purpleTextOverlay);
  $purpleTextWrapper.appendChild($purpleTextName);

  $notification.appendChild($purpleTextWrapper);

  // setTimeout(function(){
  //   $notification.classList.toggle('hidden');
  // }, 8000);

}
