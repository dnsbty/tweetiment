$(function(){

  //bring in tweets
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var terms = encodeURIComponent($('#terms').val());
    console.log('Terms: ' + terms);

  	$.getJSON( '/search/' + terms, function( data ) {
      var count = data.statuses.length,
          total = 0;
      $('.tweets').html('<table id="tweets"></table>');
      $.each(data.statuses, function( index, tweet ){
        console.log(tweet);
        $('.tweets').prepend('<div class="tweet" id="'+tweet.id+'"></div>')
                    .attr('data-sentiment', tweet.sentiment.score);
        $('#'+tweet.id).append('<img class="profile-image" src="'+tweet.user.profile_image_url+'">')
                       .append('<h2>'+tweet.user.screen_name+'</h2>')
                       .append('<p class="tweet">'+tweet.text+'</p>');
        $('#'+tweet.id+' p.tweet').tweetParser();

        total += tweet.sentiment.score;
      });
      $('.tweets').prepend('Average Sentiment: ' + total/count);
    });
    return false;
  });

});