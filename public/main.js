
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
//static variables
var turnMessage = "It's your turn!  Pick your favorite answer above!"
var notTurnMessage = "Pick a .gif below as your answer!"

//starting score and players
var score = [0,0,0,0]
var players = ["a cat","Beebs","yet another cat","a person falling down"]
var selector = 1


///////////////////////////SETUP/////////////////////////////

//INCOMING EVENT: Receive player number, name, question and room.
var playerId
var roomId
socket.on('setup', function(res){
  playerId = res.playerId;
  var playerName = players[playerId - 1]
  $(".playerName").html("You are "+playerName+".")

  $(".question").html(res.question)

  roomId = res.roomId;
  console.log(playerId);
  console.log(roomId);

  //display directions
  if (selector === playerId) {
    $(".turnDisplay").html(turnMessage)
  }else{
    $(".turnDisplay").html(notTurnMessage)
  }
})

//function for dealing the cards
function deal(){
for (var i = 0; i < 4; i++) {
  $(".hand").children().remove()
  $(".board").children().not("p").remove()

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
socket.on('newgame', function(res){
  //change who the selector is
  if (selector === 4){
    selector = 1
  }else{
    selector++
  }

  //display directions
  if (selector === playerId) {
    $(".turnDisplay").html(turnMessage)
  }else{
    $(".turnDisplay").html(notTurnMessage)
  }

  //Reset everything.  Re-deal.
  $(".question").html(res.newQuestion)
  $(".winOrLose").css({"display":"none"})
  canhand = true
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
      socket.emit('selection', {"playerWinner":$(this).data("player"), 'roomId':roomId})
    }
      canboard = false
})


//INCOMING EVENT: Update scoreboard.  Tell winner they won; others they lost.
socket.on('sendWinner', function(res){
    console.log(res)
    //edit the score
    var winner
    switch (res) {
      case 1: score[0]++
      winner = "Player 1"
      break;
      case 2: score[1]++
      winner = "Player 2"
      break;
      case 3: score[2]++
      winner = "Player 3"
      break;
      case 4: score[3]++
      winner = "Player 4"
      break;
    }

    $(".score1").html("A Cat: " + score[0])
    $(".score2").html("Beebs: " + score[1])
    $(".score3").html("Yet Another Cat: " + score[2])
    $(".score4").html("A Person Tripping: " + score[3])


    //show win/lose message
    if (playerId === selector){
      $(".winOrLose").html("Terrible choice, " + winner + " wins.")
    }else if (playerId === res){
      $(".winOrLose").html("You win.  You must be a terrible person...")

    }else{
      $(".winOrLose").html(winner + " wins, you lose. Ha.")
    }

    $(".winOrLose").css({"display":"block"})

})















})
