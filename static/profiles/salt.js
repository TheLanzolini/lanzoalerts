var PROFILE = 'salt'
var ROOM = location.pathname.replace('/user/', '').replace('/profile/' + PROFILE, '');

// if(location.search == '?test'){
//   var QUEUE = [
//     {}
//   ]
// } else {
//   var QUEUE = [];
// }

var $notification, ctx;

var $canvas = document.createElement('canvas');
$canvas.width = window.innerWidth;
$canvas.height = window.innerHeight;

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');
  $notification.appendChild($canvas);
  ctx = $canvas.getContext('2d');

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Bungee|Teko";
  document.head.appendChild(link);

  var socket = io(`/${ROOM}`);

  socket.on('!salt', function(data){
    throwSalt();
  });

});

function throwSalt() {
  ctx.fillStyle = 'black'
  ctx.fillRect(50, 50, 50, 50)
}
