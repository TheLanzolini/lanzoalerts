var ROOM = 'test'

window.addEventListener('DOMContentLoaded', function(){
  console.log('I AM HERsE')
  var socket = io(`/${ROOM}`);
  socket.on('init', function(data){
    console.log(data);
  });
  socket.on('asd', function(data){
    console.log(data);
  });
});
