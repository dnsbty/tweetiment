$(function(){

  //bring in tweets
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var terms = encodeURIComponent($('#terms').val());
    console.log('Terms: ' + terms);

    //send the request to the server
  	$.getJSON( '/search/' + terms, function( data ) {
      var count = data.statuses.length,
          total = 0;
      $.each(data.statuses, function( index, tweet ){
        console.log(tweet);
        $('.tweets').append('<div class="tweet" id="'+tweet.id+'"></div>')
                    .attr('data-sentiment', tweet.sentiment.score);
        $('#'+tweet.id).append('<img class="profile-image" src="'+tweet.user.profile_image_url+'">')
                       .append('<h2>'+tweet.user.screen_name+'</h2>')
                       .append('<p class="tweet">'+tweet.text+'</p>');
        $('#'+tweet.id+' p.tweet').tweetParser();

        if (tweet.sentiment.score > 0)
          $('#'+tweet.id).css('background-color', 'rgba(214, 233, 198, '+tweet.sentiment.score/10+')')
                         .css('color', '#3c763d');
        else if (tweet.sentiment.score < 0)
          $('#'+tweet.id).css('background-color', 'rgba(221, 153, 153, '+Math.abs(tweet.sentiment.score)/10+')')
                         .css('color', '#a94442');

        total += tweet.sentiment.score;
      });
      $('.tweets').prepend('Average Sentiment: ' + total/count);
    });
    return false;
  });

});

//google analytics stuff
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-36670106-5', 'auto');
ga('send', 'pageview');
