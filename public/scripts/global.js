$(function(){

  //bring in tweets
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var terms = $('#terms').val();
  	$.getJSON( '/search/' + terms, function( data ) {
      console.log(data);
    });
    return false;
  });

});