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

    var newid = usercounter

    if (usercounter === 1){
      roomid = socket.id
    }else{
      socket.join(roomid)
    }


    socket.emit('userId', {"newid" : newid, "roomid" : roomid})

    if (usercounter !== 4) {
      usercounter++
    }else{
      // io.to(roomid).emit('updatescore', [0,0,0,0])
      usercounter = 1;
    }

///////////////


    socket.on('sendcard', function(res){
      io.to(res.room).emit('sendcard', res.card)
    })

    socket.on('selection', function(res){

      var score = res.score
      switch (res.playerwinner) {
        case 1: score[0]++
        break;
        case 2: score[1]++
        break;
        case 3: score[2]++
        break;
        case 4: score[3]++
        break;
      }
      io.to(res.room).emit('updatescore', score)

      io.to(res.room).emit('newgame')
    })









});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
