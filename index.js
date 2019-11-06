var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var positions = {};
var users = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  for (var synced_draggable in positions) {
    io.emit('update_position', positions[synced_draggable]);
  }

  socket.on('disconnect', function() {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    console.log('user disconnected');
  });

  socket.on('receive_position', function(data) {
    //console.log('receive_position', data)
    positions[data.id] = data;
    socket.broadcast.emit('update_position', positions[data.id]); // send `data` to all other clients
  });

  socket.on('chat message', function(data) {
    io.emit('chat message', {msg: data.text, user: socket.username, color: data.color});
  });

  socket.on('new user', function(data){
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.emit('get users', users);
  }
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
