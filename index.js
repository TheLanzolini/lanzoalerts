const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const ROOMS = {};
let ROOM_NAMES;

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

// initialize socket rooms
fs.readdir(`${__dirname}/static/profiles`, function(err, files){
  const rooms = files.map(function(file){
    return file.replace('.js', '');
  });
  ROOM_NAMES = rooms;
  rooms.forEach(function(room){
    ROOMS[room] = io.of(`/${room}`);
  });
  ROOM_NAMES.forEach(function(name){
    ROOMS[name].on('connection', function(socket){
      socket.emit('init', {name: name});
    });
  });
  io.on('connection', function (socket) {
    console.log('user connected', socket.rooms);
  });
});
