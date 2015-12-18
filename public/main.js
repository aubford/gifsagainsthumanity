
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
var turnMessage = "It's your flippin turn!  Pick your favorite answer above!"
var notTurnMessage = "Pick a .gif below as your answer!"

//starting score and players
var players = [{moniker: "a cat", score: 0}, {moniker: "dancing baby", score: 0}, {moniker: "another cat", score: 0}, {moniker: "Charlie", score: 0}, {moniker: "pizza rat", score: 0}]

var selector


///////////////////////////SETUP/////////////////////////////

//INCOMING EVENT: Receive player number, name, question and room.
var playerId
var roomId
socket.on('setup', function(res){
  playerId = res.playerId;
  var playerName = players[playerId].moniker
  $(".playerName").html("You are "+playerName+".")

  selector = 0
  $(".question").html("Please wait for players to join")

  roomId = res.roomId;
  console.log(playerId);
  console.log(roomId);

  //display directions
  if (selector === playerId) {
    $(".hand").html(turnMessage)
  }else{
    $(".turnDisplay").html(notTurnMessage)
  }
})

//function for dealing the cards
function deal(){
  $(".hand").children().remove()
  $(".board").children().not("p").remove()

  for (var i = 0; i < 4; i++) {
    var callrandom = getgifs()
    callrandom.done(function(res){
    $(".hand").append("<img data-player="+playerId+" class='handcard' src='"+res.data.image_url+"'>")
    })
  }

}
//call it
socket.on('deal', function(res){

  $(".question").html(res.question)

  if (selector !== playerId){
    deal()
  }

})

///////////////////////////RESET//////////////////////////

//INCOMING EVENT: Reset the game.
socket.on('newgame', function(res){
  //change who the selector is
  $(".hand").html("")

  if (selector === 4){
    selector = 0
  }else{
    selector++
  }
  
  $(".hand").children().remove()
  $(".board").children().not("p").remove()


  //display directions
  if (selector === playerId) {
    $(".hand").html(turnMessage)
    $(".turnDisplay").html("")
  }else{
    $(".turnDisplay").html(notTurnMessage)
  }

  //Reset everything.  Re-deal.
  $(".question").html(res.newQuestion)
  $(".winOrLose").css({"display":"none"})
  canhand = true
  canboard = true

  if (selector !== playerId){
    deal()
  }

})

//////////////PLAY BEGINS///////////////////////

//OUTPUT EVENT: Player can select a card to add to board.
var canhand = true
$(document).on("click", ".handcard", function(){
    if (canhand === true && selector !== playerId){
    socket.emit("sendcard", {"card":$(this)[0].outerHTML,"roomId":roomId})
    }
    canhand = false
})

//INCOMING EVENT: Add card to THIS board.
socket.on("sendcard", function(card){
  $(".board").append(card)
  $(".board").children().removeClass("handcard").addClass("boardcard")
})

////////////////////////SELECTION///////////////////////

//OUTPUT EVENT: If THIS is selector; click = winning card
var canboard = true
$(document).on("click", ".boardcard", function(){
    if (selector === playerId && canboard === true){
      //send: winning card's playerId, the roomId, and current score.
      socket.emit("selection", {"playerWinner":$(this).data("player"), "roomId":roomId})
    }
      canboard = false
})


//INCOMING EVENT: Update scoreboard.  Tell winner they won; others they lost.
socket.on("sendWinner", function(res){
    //edit the score
    players[res].score++
    var winner = players[res].moniker
    console.log(typeof res)

    players.forEach(function(e,i){
      $(".score" + i).html(e.moniker + ": " + e.score)
    })

    //winning card jumps!
    var winCard = $(".boardcard[data-player="+res+"]")

    function flash () {
      winCard.animate({"bottom":"10vh"}, 200).animate({"bottom":"0"},200,flash)
    }
    flash()

    //show win/lose message
    if (playerId === selector){
      $(".winOrLose").html(winner + " wins, terrible choice.")
    }else if (playerId === res){
      $(".winOrLose").html("You win.  You must be a terrible person...")
    }else{
      $(".winOrLose").html(winner + " wins, you lose.")
    }


    $(".winOrLose").css({"display":"block"})

})















})
