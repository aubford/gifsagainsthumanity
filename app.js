var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.set("view engine", "ejs");
app.use(express.static("public"));



app.get('/', function(req, res){
  res.render('index');
});


var usercounter = 1
var roomid

io.on('connection', function(socket){
  console.log("a user connected")
//////////////////
  var newid = "player" + usercounter

  if (usercounter === 1){
    roomid = socket.id
  }else{
    socket.join(roomid)
  }

  if (usercounter !== 4) {
    usercounter++
  }else{
    usercounter = 1;
    io.emit('startgame', "player1")
  }
///////////////
  socket.emit('userId', {"newid" : newid, "roomid" : roomid})

  socket.on('sendcard', function(res){
    io.to(res.room).emit('sendcard', res.card)
  })


  socket.on('disconnect', function(){
    console.log("a user disconnected")
  })
});










http.listen(3000, function(){
  console.log('listening on *:3000');
});
