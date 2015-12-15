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

io.on('connection', function(socket){
  console.log("a user connected")

  var newid = "player" + usercounter

  console.log(userid)

  if (usercounter =! 4) {
    usercounter++
  }else{
    usercounter = 1;
  }

  console.log(usercounter)

  socket.emit('userId', {"newid" : newid})

  socket.on('sendcard', function(res){
    console.log(res)
    io.emit('sendcard', res)
  })


  socket.on('disconnect', function(){
    console.log("a user disconnected")
  })
});










http.listen(3000, function(){
  console.log('listening on *:3000');
});
