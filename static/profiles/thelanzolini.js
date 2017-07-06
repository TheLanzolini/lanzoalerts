window.addEventListener('DOMContentLoaded', function(){
  console.log('I AM HERsE')
  var socket = io();
  socket.on('news', function(data){
    console.log(data)
  })
});
