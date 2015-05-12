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