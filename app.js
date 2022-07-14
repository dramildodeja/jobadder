const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('port', 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./app/routes')(app);
http.createServer(app).listen(app.get('port'), function(){
	console.log('App started on port ' + app.get('port'));
});
