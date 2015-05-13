$(function(){

  //focus on input on page load for easy usability
  $("#terms").focus();

  //get current trends as suggestions
  $.getJSON('/trends/', function(data) {
    $('#trends').text('');
    $.each(data.trends, function(index, trend) {
      $('#trends').append('<p><a class="trend">'+trend.name+'</a></p>')
    });
  });

  //bring in tweets
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var terms = encodeURIComponent($('#terms').val());
    $('.tweets').html('<div class="container top">Loading...</div>');
    showTab('tweets');

    //send the request to the server
  	$.getJSON( '/search/' + terms, function( data ) {
      var count = data.statuses.length,
          total = 0,
          best = worst = data.statuses[0];

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
        //and save the most positive and negative tweets
        if (tweet.sentiment.score > 0)
        {
          $('#'+tweet.id).addClass('pos pos-'+tweet.sentiment.score);
          if (tweet.sentiment.score > best.sentiment.score)
            best = tweet;
        }
        else if (tweet.sentiment.score < 0)
        {
          $('#'+tweet.id).addClass('neg neg'+tweet.sentiment.score);
          if (tweet.sentiment.score < worst.sentiment.score)
            worst = tweet;
        }

        total += tweet.sentiment.score;
      });

      //display the stats
      $('#count span').text(count);
      $('#average span').text((total / count).toFixed(2));
      $('#best span').text(best.sentiment.score);
      $('#best a.link').attr('rel', best.id);
      $('#worst span').text(worst.sentiment.score);
      $('#worst a.link').attr('rel', worst.id);
      showTab('stats');
    });
    return false;
  });
});

//search for trend from trend links
$('#trends').on('click', 'a.trend', function(e) {
  var trend = $(this).text();
  $('#terms').val(trend);
  $('#search').submit();
});

//show tab from footer link click
$('a.tab').on('click', function() {
  showTab($(this).attr('rel'));
});

//scroll to tweet
$('a.link').on('click', function() {
  showTab('tweets');
  $('html, body').animate({
      scrollTop: $('#' + $(this).attr('rel')).offset().top - $('header').outerHeight()
  }, 500);
});

//button group handling for settings
$('.btn-group button').on('click', function() {
  $(this).siblings('button').removeClass('active');
  $(this).addClass('active');
});

//mute coloring button group handling for settings
$('.btn-group#coloring button').on('click', function() {
  if ($(this).attr('rel') == 'on')
    $('div.tweet').removeClass('muted');
  else
    $('div.tweet').addClass('muted');
});

//number field handling for settings
$('.input-group.number button').on('click', function() {
  if ($(this).attr('rel') == 'down')
    $(this).parents('span').siblings('input').val(parseInt($(this).parents('span').siblings('input').val()) - 1);
  else if ($(this).attr('rel') == 'up')
    $(this).parents('span').siblings('input').val(parseInt($(this).parents('span').siblings('input').val()) + 1);
});

//hide all tabs and display the one that is passed in
function showTab(tab)
{
  $.each([ 'intro', 'stats', 'tweets', 'settings' ], function( index, div ){ $('.' + div).hide();});
  $('.' + tab).show();
  $('a.tab').removeClass('active');
  $('a.tab[rel='+tab+']').addClass('active');
}

//google analytics stuff
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-36670106-5', 'auto');
ga('send', 'pageview');
