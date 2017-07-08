var ROOM = 'thelanzolini'

window.addEventListener('DOMContentLoaded', function(){
  var socket = io(`/${ROOM}`);
  socket.on('init', function(data){
    console.log(data);
  });
  socket.on('chat', function(data){
    console.log(data);
  });
  socket.on('join', function(data){
    console.log(data);
  });
  socket.on('subscription', function(data){
    console.log(data);
  });
  socket.on('resub', function(data){
    console.log(data);
  });
});
