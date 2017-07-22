const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const tmi = require("tmi.js");

// YOUR BOT USERNAME
const BOT_USERNAME = 'Lanzobot';
const FOLLOWS_INTERVAL = 60000;

const ROOMS = {};
const FOLLOWS_INFO = {};
let ROOM_NAMES, CLIENT, CHANNEL_NAMES, CHANNEL_IDS;

const commands = {
  'thelanzolini': [
    '!victory'
  ]
}

// env variables that are required
const OAUTH = process.env.OAUTH;
const CLIENT_ID = process.env.CLIENT_ID;

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
  // [ 'test', 'thelanzolini' ]
  // create room for each profile
  ROOM_NAMES.forEach(function(room){
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

  CHANNEL_NAMES = ROOM_NAMES.map(function(name){
    return `#${name}`;
  });

  CLIENT = new tmi.client({
    options: {
      debug: true
    },
    connection: {
      reconnect: true
    },
    identity: {
      username: BOT_USERNAME,
      password: OAUTH
    },
    channels: CHANNEL_NAMES
  });

  // Connect the client to the server..
  CLIENT.connect();

  ROOM_NAMES.forEach(function(name){
    CLIENT.api({
      url: `https://api.twitch.tv/kraken/users?login=${name}`,
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': process.env.CLIENT_ID
      }
    }, function(err, res, body){
      if(body.users && body.users.length > 0 && body.users[0].name == name) {
        FOLLOWS_INFO[name] = { id: body.users[0]._id };
      }
    })
  });

  CLIENT.on('chat', function(channel, userstate, message, self){
    console.log(channel, message);
    const chan = channel.replace('#', '');
    // ROOMS[chan].emit('chat', { userstate, message });
    if(!!commands[chan]){
      commands[chan].forEach(function(command){
        if(message.includes(command)){
          ROOMS[chan].emit(command, { userstate, message });
        }
      });
    }
  });

  CLIENT.on('join', function(channel, username, self){
    ROOMS[channel.replace('#', '')].emit('join', { username });
  });

  CLIENT.on('subscription', function (channel, username, method, message, userstate) {
    ROOMS[channel.replace('#', '')].emit('subscription', { username, method, message, userstate });
  });

  CLIENT.on('resub', function (channel, username, months, message, userstate, methods) {
    ROOMS[channel.replace('#', '')].emit('resub', { username, months, message, userstate, methods });
  });

  CLIENT.on('cheer', function (channel, userstate, message) {
    ROOMS[channel.replace('#', '')].emit('cheer', { channel, userstate, message });
  });

  const followsInterval = setInterval(function(){
    const keys = Object.keys(FOLLOWS_INFO);
    keys.forEach(function(key){
      const { oauth, id } = FOLLOWS_INFO[key];
      CLIENT.api({
        url: `https://api.twitch.tv/kraken/channels/${id}/follows`,
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': process.env.CLIENT_ID
        }
      }, function(err, res, body){
        const { follows } = body;
        follows.forEach(function(follow) {
          const timeFollowed = new Date(follow.created_at).getTime();
          const currentTime = new Date().getTime();
          if(currentTime - timeFollowed < FOLLOWS_INTERVAL){
            ROOMS[key].emit('follow', follow);
          }
        });
      });
    });

  }, FOLLOWS_INTERVAL);

});
