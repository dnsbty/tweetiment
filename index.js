//create and configure the express app and server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var sentiment = require('sentiment');

//load environment variables
var env = require('node-env-file');
env(__dirname + '/.env');

//
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

//set up the twitter instance
//documentation at https://github.com/ttezel/twit
var Twit = require('twit');
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

//display the app
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/search/:terms', function (req, res, next) {
  var tweets = twitter.get('search/tweets', 
    { 
      q: req.params.terms + ' -filter:retweets', 
      count: 100,
      result_type: 'recent'
    }, 
    function(err, data, response) {
    for (i = 0; i < data.statuses.length; i++)
    {
      data.statuses[i].sentiment = sentiment(data.statuses[i].text);
    }
    res.json(data);
  })
});

//start the server listening for requests
server.listen(app.get('port'), function() {
  console.log("Tweetiment is running at localhost:" + app.get('port'));
});
