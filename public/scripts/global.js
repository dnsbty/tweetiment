$(function(){

  //focus on input on page load for easy usability
  $("#terms").focus();

  //bring in tweets
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var terms = encodeURIComponent($('#terms').val());
    $('.tweets').html('Loading...');
    showTab('tweets');

    //send the request to the server
  	$.getJSON( '/search/' + terms, function( data ) {
      var count = data.statuses.length,
          total = 0;

      //clear the display and then show all the tweets
      $('.tweets').html('');
      $.each(data.statuses, function( index, tweet ){
        $('.tweets').append('<div class="tweet" id="'+tweet.id+'"></div>')
                    .attr('data-sentiment', tweet.sentiment.score);
        $('#'+tweet.id).append('<img class="profile-image" src="'+tweet.user.profile_image_url+'">')
                       .append('<h2>'+tweet.user.screen_name+'</h2>')
                       .append('<p class="tweet">'+tweet.text+'</p>');
        $('#'+tweet.id+' p.tweet').tweetParser();

        //change the background color based on sentiment score
        if (tweet.sentiment.score > 0)
          $('#'+tweet.id).css('background-color', 'rgba(214, 233, 198, '+tweet.sentiment.score/10+')')
                         .css('color', '#3c763d');
        else if (tweet.sentiment.score < 0)
          $('#'+tweet.id).css('background-color', 'rgba(221, 153, 153, '+Math.abs(tweet.sentiment.score)/10+')')
                         .css('color', '#a94442');

        total += tweet.sentiment.score;
      });
    });

    //show the footer
    $('footer').show();
    return false;
  });

});

//show tab from footer link click
$('a.tab').on('click', function() {
  showTab($(this).attr('rel'));
});

//hide all tabs and display the one that is passed in
function showTab(tab)
{
  $.each([ 'intro','stats', 'tweets', 'settings' ], function( index, div ){ $('.' + div).hide();});
  $('.' + tab).show();
}

//google analytics stuff
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-36670106-5', 'auto');
ga('send', 'pageview');
