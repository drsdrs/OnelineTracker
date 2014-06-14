var express = require('express')
, app = express()
, server = app.listen(3333)
;

c = console; c.l = c.log;

//app.configure(function() {
	app.use(express.static('public'));
  app.use('/lib', express.static(__dirname + '/bower_components'));
  app.use('/libN', express.static(__dirname + '/node_modules'));
//});

app.get('/', function(req, res){
  app.use('/', express.static(__dirname + '/public/'));
  res.sendfile('./public/index.html');
});

