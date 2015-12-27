var getHandsHistory = function(){
  $.get("/hands", function(response){
    console.log(response);
    renderCardsHistory(response);
  });
}

var getHandActual = function() {
  $.get("/randomHands", function(response){
    renderCards(response);
  });
}

var renderCardsHistory = function(response){
  var html = '',
      dhistory = $('div.history');

    for (var i=response.length - 1; i >= 0; i-- ) {
      hand = response[i].hand;
      html += '<ul>';
      hand.forEach(function(hO){
        html += '<li data-rank="' + hO.rank + '" data-suit="' +
        hO.suit + '"><img src="../images/' + hO.rank + '_of_' + hO.suit + '.png"></li>';
      });
      html += '</ul><p>Contém: ' + response[i].handString + '</p>';
    }

    dhistory.html(html);
}

var renderCards = function(response){
  var dhand = $('div.hand'),
      html = '<ul>';
    response.forEach(function(o){
      html += '<li data-rank="' + o.rank + '" data-suit="' +
      o.suit + '"><img src="../images/' + o.rank + '_of_' + o.suit + '.png"></li>';
    });
    html += '</ul>';
    dhand.html(html);
}

$(document).ready(function(){

  var $button = $('button');
  getHandActual();
  setInterval(function(){
    getHandActual();
    $button.trigger('click');
  }, 5000);

  getHandsHistory();

  $button.on('click', function(e){
    e.preventDefault();
    var hand = [],
        cards = $('.hand ul li');

    cards.each(function(){
      hand.push({
        "rank": $(this).data('rank'),
        "suit": $(this).data('suit')
      });
    });

    $.post("/hand", {"hand": hand}, function(response){
      console.log(response);
      renderCardsHistory(response);
    });
  });
});
