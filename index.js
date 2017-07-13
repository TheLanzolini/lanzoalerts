const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const tmi = require("tmi.js");

// YOUR BOT USERNAME
const BOT_USERNAME = 'Lanzobot';

const ROOMS = {};
const FOLLOWS_INFO = {};
let ROOM_NAMES, CLIENT, CHANNEL_NAMES, CHANNEL_IDS;

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

app.get('/login', function(req, res) {
  res.redirect(`https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${process.env.CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost&scope=user_read`);
});

// make proxy for request because need client id
app.post('/api/user', function(exreq, exres) {
  const oauth = exreq.headers['x-lanzo-oauth-token'];
  CLIENT.api({
    url: 'https://api.twitch.tv/kraken/user',
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': `OAuth ${oauth}`,
      'Client-ID': process.env.CLIENT_ID
    }
  }, function(err, res, body) {
    console.log(body);
    if(ROOM_NAMES.includes(body.name)){
      FOLLOWS_INFO[body.name] = {
        oauth: oauth,
        id: body._id
      }
      exres.json({ redirect: `/${body.name}` });
    }
  });

});

app.get('/redirect', function(req, res) {
  res.render('redirect');
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

  // CLIENT.on('chat', function(channel, userstate, message, self){
  //   console.log(channel, message);
  //   ROOMS[channel.replace('#', '')].emit('chat', { userstate, message });
  // });

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
    ROOMS[channel.replace('#', '')].emit('cheer', { channel, userstate, message })
  });

  const followsInterval = setInterval(function(){
    console.log('follows info', FOLLOWS_INFO);
  }, 60000);

  // CLIENT.api({
  //   url: "https://api.twitch.tv/kraken/channels/<channel ID>/follows"
  // }, function(err, res, body) {
  //   console.log(body);
  // });

  // const followsInterval = setInterval(function(){
  //
  // }, 300000);

});
