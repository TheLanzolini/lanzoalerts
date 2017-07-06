var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

// express init
server.listen(process.env.PORT || 8000);
app.set('view engine', 'pug');
app.use(express.static('static'));

// express routes
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/:profile', function (req, res) {
  fs.exists(`${__dirname}/static/profiles/${req.params.profile}.js`, function(exists){
    if(exists){
      res.render('layout', { profile: req.params.profile })
    }else{
      res.render('noprofile', { profile: req.params.profile })
    }
  });
});

// socket
io.on('connection', function (socket) {
  console.log('user connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
