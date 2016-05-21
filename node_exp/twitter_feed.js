var Particle = require('particle-api-js');
var particle = new Particle();
var Twit = require('twit');

var T = new Twit({
    consumer_key:         'S1QTp0M4ICOCdCjmzdnSIx6YP'
  , consumer_secret:      'spAcuk6AOA26tC9VMjkSZ7roDfBoFEVtofiBX1K9miqdN34L58'
  , app_only_auth:        true
})

var options = { screen_name: 'elnacionalweb',
                count: 1 };

var lastTweetTime = -1;
var LEDStatus = 'off';
var toggle = false;

particle.login({username: 'danielmacario5@gmail.com', password: 'elpajarodicehola1.'}).then(
  function(data){
    console.log('API call completed on promise resolve: ', data.body.access_token);
    token = data.body.access_token;
    T.get('statuses/home_timeline', options , function(err, data) {
      for (var i = 0; i < data.length ; i++) {
        console.log(data[i].text);
        var date = new Date(data[i].created_at);
        lastTweetTime = date.getTime() / 1000;
        console.log(lastTweetTime);
      }
    }).then(function(data) {
      mainLoop();
    })
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

function toggleLEDState(token) {
  var fnPr = particle.callFunction({ deviceId: '53ff74065075535138231087', name: 'led', argument: 'on', auth: token });
  fnPr.then(
    function(data) {
      console.log('LED is now ON');
      setTimeout(function() {
        var fnPr2 = particle.callFunction({ deviceId: '53ff74065075535138231087', name: 'led', argument: 'off', auth: token });
        fnPr2.then(
          function(data) {
            console.log('LED is now OFF');
          }, function(err) {
            console.log('An error occurred', err);
          }
        )
      }, 3000)
    }, function(err) {
      console.log('An error occurred:', err);
    });
}

function getLastTweet() {
  T.get('statuses/user_timeline', options , function(err, data) {
    if (err) console.log(err);
    for (var i = 0; i < data.length ; i++) {
      console.log(data[i].text);
      var date = new Date(data[i].created_at);
      var time = date.getTime() / 1000;
      console.log(time);
      if (time > lastTweetTime) {
        lastTweetTime = time;
        toggle = true;
      }
    }
  }).then(function(data) {
    if (toggle) {
      toggleLEDState(token);
      toggle = false;
    }
  })
}

function mainLoop() {
  setInterval(function() {
    console.log('Checking for tweets');
    getLastTweet();
  }, 5000)
}
