var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', function(req, res){
  res.render('index');
});


///SOCKETS///
//code for each socket connection.
var questionBank = require("./public/questionBank.js")
var userCounter = 1
var roomId
var startingQuestionNumber

io.on('connection', function(socket){
//////////////SETUP//////////////////////////
    //determines which player# this is.
    var newId = userCounter

    //if socket is a Player1, then it's socket.id is the new roomId.
    if (userCounter === 1){
      roomId = socket.id
      startingQuestionNumber = Math.floor(Math.random() * questionBank.questions.length)
    //other players add this roomId.
    }else{
      socket.join(roomId)
    }


    //OUTPUT-THIS EVENT: tack userId and roomId to the new socket's main.js.
    socket.emit('userId', {"newId" : newId, "roomId" : roomId, "question":questionBank.questions[startingQuestionNumber]})
    io.to(roomId).emit('updatescore', [0,0,0,0])


    //counter for userCounter increments between 1 and 4.
    if (userCounter !== 4) {
      userCounter++
    }else{
      userCounter = 1;
    }

/////////////ACTIONS//////////////////////////

    ///HAND CARD///

    //INCOMING EVENT: player clicked a hand-card
    socket.on('sendcard', function(res){
      //OUTPUT-ALL EVENT: send that card to other palyers in room.
      io.to(res.roomId).emit('sendcard', res.card)
    })



    ///WINNING CARD///

    //INCOMING EVENT:  selector chose winning card.
    socket.on('selection', function(res){
      //+1 point for winning player
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
      //OUTPUT-ALL EVENT: send the score to all players in room.
      io.to(res.roomId).emit('updatescore', score)
      //OUTPUT-ALL EVENT: send 'newgame' event to all players in room.
      io.to(res.roomId).emit('newgame', {'newQuestion': questionBank.questions[Math.floor(Math.random() * questionBank.questions.length)]})
      
    })




});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
