
$(function(){

var socket = io()

function getgifs(){
      return $.ajax({
      url:"http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC",
      method:"GET",
      dataType:"json"
    })
  }

for (var i = 0; i < 4; i++) {
  var callrandom = getgifs()
  callrandom.done(function(res){
    console.log(res)
  $(".hand").append("<img data-player='player1' class='handcard' src='"+res.data.image_url+"'>")
  })
}

var canhand = true
$(document).on('click', ".handcard", function(){
    if (canhand === true){
    socket.emit('sendcard', $(this)[0].outerHTML)
    }
    canhand = false
})

socket.on('sendcard', function(res){
  // var newcard = res.removeClass("handcard").addClass("boardcard")
  $('.board').append(res)
  $('.board').children().removeClass("handcard").addClass("boardcard")
})


})
