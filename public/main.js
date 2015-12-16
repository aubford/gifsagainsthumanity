
$(function(){
var socket = io()

//Function for API calls to Giphy
function getgifs(){
      return $.ajax({
      url:"http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC",
      method:"GET",
      dataType:"json"
    })
  }


//starting score and players
var score = [0,0,0,0]
var players = ["a cat","Beebs","another cat","a person falling down"]


///////////////////////////SETUP/////////////////////////////

//INCOMING EVENT: Receive player number, name, question and room.
var playerId
var roomId
socket.on('userId', function(ids){
  playerId = ids.newId;
  var playerName = players[playerId - 1]
  $(".playerName").html("You are "+playerName+".")

  $(".question").html(ids.question)

  roomId = ids.roomId;
  console.log(playerId);
  console.log(roomId);
})

//function for dealing the cards
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
//call it
deal()

///////////////////////////RESET//////////////////////////

//INCOMING EVENT: Reset the game.
var selector = 1
socket.on('newgame', function(res){
  //change who the selector is
  if (selector === 4){
    selector = 1
  }else{
  selector++
  }
  //Reset everything.  Re-deal.
  $(".question").html(res.newQuestion)
  canhand=true
  canboard = true

  deal()
  
  console.log(selector)
})

///////////////////////PLAY BEGINS///////////////////////

//OUTPUT EVENT: Player can select a card to add to board.
var canhand = true
$(document).on('click', ".handcard", function(){
    if (canhand === true && selector !== playerId){
    socket.emit('sendcard', {"card":$(this)[0].outerHTML,"roomId":roomId})
    }
    canhand = false
})

//INCOMING EVENT: Add card to THIS board.
socket.on('sendcard', function(card){
  $('.board').append(card)
  $('.board').children().removeClass("handcard").addClass("boardcard")
})


////////////////////////SELECTION///////////////////////

//OUTPUT EVENT: If THIS is selector; click = winning card
var canboard = true
$(document).on('click', '.boardcard', function(){
    if (selector === playerId && canboard === true){
      //send: winning card's playerId, the roomId, and current score.
      socket.emit('selection', {"playerwinner":$(this).data("player"), 'roomId':roomId, 'score':score})
    }
      canboard = false
})


//INCOMING EVENT: Update scoreboard.
socket.on('updatescore', function(scoreincoming){
    score = scoreincoming
    $(".score1").html("A Cat: " + score[0])
    $(".score2").html("Beebs: " + score[1])
    $(".score3").html("Another Cat: " + score[2])
    $(".score4").html("A Person Falling Down: " + score[3])
})















})
