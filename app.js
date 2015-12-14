var app = require('express')();
var http = require('http').Server(app);


app.set("view engine", "ejs")

app.use(express.static("public"))

app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>')
  res.render('index');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
