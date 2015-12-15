
$(function(){

var socket = io()

function getgifs(){
      return $.ajax({
      url:"http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC",
      method:"GET",
      dataType:"json"
    })
  }


var playerId
var roomId
socket.on('userId', function(id){
  playerId = id.newid;
  roomId = id.roomid;
  console.log(playerId);
  console.log(roomId);
})

for (var i = 0; i < 4; i++) {
  var callrandom = getgifs()
  callrandom.done(function(res){
  $(".hand").append("<img data-player='"+playerId+"' class='handcard' src='"+res.data.image_url+"'>")
  })
}


var selector
socket.on('startgame', function(res){
  selector = res
  console.log(selector)
})
///////
var canhand = true
$(document).on('click', ".handcard", function(){
    if (canhand === true){
    socket.emit('sendcard', {"card":$(this)[0].outerHTML,"room":roomId})
    }
    canhand = false
})

socket.on('sendcard', function(card){
  $('.board').append(card)
  $('.board').children().removeClass("handcard").addClass("boardcard")
})
/////////////////
$(document).on('click', '.boardcard', function(){
    if (selector === playerId){
      socket.emit('selection', {"card":$(this).})
    }
})





















})
