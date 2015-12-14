
$(function(){


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
  $(".hand").append("<img data-player='player1' src='"+res.data.image_url+"'>")
  })
}
})
