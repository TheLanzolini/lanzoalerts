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

function Grain(x, y, radius, xspeed, yspeed) {
  this.x = x || 50;
  this.y = y || 50;
  this.radius = radius || 5;
  this.xspeed = xspeed || 1;
  this.yspeed = yspeed || -2;

  this.draw = function(ctx) {
    // console.log(ctx)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    this.x = this.x += this.xspeed;
    this.y = this.y += this.yspeed;
    if (this.xspeed > 0.2) {
      this.xspeed -= 0.05;
    }

  }

}

window.addEventListener('DOMContentLoaded', function(){
  $notification = document.getElementById('notification');
  $notification.appendChild($canvas);
  ctx = $canvas.getContext('2d');

  var grainOne = new Grain(50, 50, 5, 1, 5);

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    grainOne.draw(ctx);
    requestAnimationFrame(draw);
  }
  // draw();
  // var interval = setInterval(draw, 60);
  requestAnimationFrame(draw);

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Bungee|Teko";
  document.head.appendChild(link);

  var socket = io(`/${ROOM}`);

  socket.on('command', function(data){
    console.log(data);
    throwSalt();
  });

});

function throwSalt() {
  ctx.fillStyle = 'black'
  ctx.fillRect(50, 50, 50, 50);



}
