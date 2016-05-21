var Particle = require('particle-api-js');
var particle = new Particle();
var readlineSync = require('readline-sync');

var token;

particle.login({username: 'danielmacario5@gmail.com', password: 'elpajarodicehola1.'}).then(
  function(data){
    changeLEDState('on', token);
    console.log('API call completed on promise resolve: ', data.body.access_token);
    token = data.body.access_token;
    beginPrompt();
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

function changeLEDState(state, token) {
  var fnPr = particle.callFunction({ deviceId: '53ff74065075535138231087', name: 'led', argument: state, auth: token });
  fnPr.then(
    function(data) {
      beginPrompt();
    }, function(err) {
      console.log('An error occurred:', err);
    });
}

function beginPrompt() {
  var command = readlineSync.question('1 for ON, 0 for OFF > ');
  if (command === '1') {
    console.log('Turning LED on');
    changeLEDState('on', token);
  } else if (command === '0') {
    console.log('Turning LED off');
    changeLEDState('off', token);
  }
}