var express = require('express');
var Particle = require('particle-api-js');
var particle = new Particle();

var app = express();
app.use(express.static('public'));

var token;
var LEDStatus = 'off';
const PORT = 8080;

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/" + "public/controls.html");
})

app.post('/toggleLED', function(req, res) {
  toggleLEDState(token);
  console.log('Toggle LED called!');
})

var server = app.listen(PORT, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port);
})

particle.login({username: 'danielmacario5@gmail.com', password: 'elpajarodicehola1.'}).then(
  function(data){
    console.log('API call completed on promise resolve: ', data.body.access_token);
    token = data.body.access_token;
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

function toggleLEDState(token) {
  // Toggle the variable
  LEDStatus = LEDStatus == 'off' ? 'on' : 'off';
  console.log('LEDStatus : ' + LEDStatus);
  var fnPr = particle.callFunction({ deviceId: '53ff74065075535138231087', name: 'led', argument: LEDStatus, auth: token });
  fnPr.then(
    function(data) {
      console.log('Toggle Succeeded!');
    }, function(err) {
      console.log('An error occurred:', err);
    });
}
