var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql');

var fs = require('fs');
var filenames = fs.readdirSync('client/assets');
filenames.shift();

var positions = {};
var users = [];
var divLog = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/');
});

app.get('/divData', function(req, res){
  res.send(divLog);
});

app.get('/filenames', function(req, res){
  res.send(filenames);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('client'));

app.post('/divs', function(req, res) {
  var data = req.body;
  var divs = [];
  for(i=0; i<divLog.length; i++){
    divs.push(divLog[i].id);
    if(divLog[i].id === data.id){
      divLog[i] = data;
    }
  }
  if(divs.includes(data.id) != true){
    divLog.push(data);
  }
  res.send(data.id);
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
    positions[data.id] = data;
    socket.broadcast.emit('update_position', positions[data.id]); // send `data` to all other clients
  });

  socket.on('chat message', function(data) {
    io.emit('chat message', {msg: data.text, user: socket.username, color: data.color, point: data.point});
  });

  socket.on('new user', function(data){
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  socket.on('new div', function(data){
    io.emit('make div', {id: data.id, html: data.html, parent: data.parent, color: data.color, point: data.point});
  });

  function updateUsernames(){
    io.emit('get users', users);
  }

});

http.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
