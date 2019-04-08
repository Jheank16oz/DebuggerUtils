
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [];

//app.use(express.static('public'));

app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {
console.log('Alguien se ha conectado con Sockets');
io.sockets.emit('messages', messages);

socket.on('new-message', function(data) {
  messages.unshift(data);
  io.sockets.emit('messages', messages);
});


});

//app.use(express.static('proveedor_logger'));
/*
app.get('/log', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/index.html');
});

app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/app.js');
});
*/
server.listen(8080, function() {
  console.log("Servidor corriendo en http://localhost:8080");
});