var ROOM = 'summit1g'
var QUEUE = [];

window.addEventListener('DOMContentLoaded', function(){
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
    var notification = QUEUE.pop();
    console.log(notification.type);
  }, 10000);

});
