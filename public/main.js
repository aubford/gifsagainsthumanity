
$(function(){

var socket = io()

function getgifs(){
      return $.ajax({
      url:"http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC",
      method:"GET",
      dataType:"json"
    })
  }

var score = [0,0,0,0]

var playerId
var roomId
socket.on('userId', function(id){
  playerId = id.newid;
  roomId = id.roomid;
  console.log(playerId);
  console.log(roomId);
})

function deal(){
for (var i = 0; i < 4; i++) {
  $(".hand").children().remove()
  $(".board").children().remove()

  var callrandom = getgifs()
  callrandom.done(function(res){
  $(".hand").append("<img data-player="+playerId+" class='handcard' src='"+res.data.image_url+"'>")
  })
}
}
deal()


var selector = 1
socket.on('newgame', function(){

  if (selector === 4){
    selector = 1
  }else{
  selector++
  }
  canhand=true
  deal()
  console.log(selector)
})
///////
var canhand = true
$(document).on('click', ".handcard", function(){
    if (canhand === true && selector !== playerId){
    socket.emit('sendcard', {"card":$(this)[0].outerHTML,"room":roomId})
    }
    canhand = false
})

socket.on('sendcard', function(card){
  $('.board').append(card)
  $('.board').children().removeClass("handcard").addClass("boardcard")
})
/////////////////


var canboard = true
$(document).on('click', '.boardcard', function(){
    if (selector === playerId && canboard === true){

      socket.emit('selection', {"playerwinner":$(this).data("player"), 'room':roomId, 'score':score})

      // console.log($(this).data("player"))

      // canboard = false

    }
})





socket.on('updatescore', function(scoreincoming){
    score = scoreincoming
    $(".score1").html("Player 1: " + score[0])
    $(".score2").html("Player 2: " + score[1])
    $(".score3").html("Player 3: " + score[2])
    $(".score4").html("Player 4: " + score[3])
    console.log(score)
})


















})
