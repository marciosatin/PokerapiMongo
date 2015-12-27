var poker = {},

ranks = ["two", "three", "four", "five", "six", "seven", "eight",
              "nine", "ten", "jack", "queen", "king", "ace"],

suits = ["spades", "hearts", "clubs", "diamonds"];

var containsNTimes = function (handRanks, rank, num) {
  var count = 0
      result =  false;

  handRanks.forEach(function (hand) {
    if (rank === hand) {
      count++;
    }
    if (count === num) {
      result = true;
    }
  });
  return result;
};

poker.randonHand = function () {
  var rHand = [],
      rdRank,
      rdSuit;

  for (var i=0; i<5; i++) {
    rdRank = ranks[Math.floor(Math.random()*ranks.length)];
    rdSuit = suits[Math.floor(Math.random()*suits.length)];

    console.log(rdRank, rdSuit);
    var finded = false;
    //evitar duplicar cartas
    rHand.forEach(function(o){
      if ((o.rank == rdRank) && (o.suit == rdSuit)) {
        console.log("Duplicou.....");
        i--;
        finded = true;
      }
    });

    if (!finded) {
      rHand.push({
        "rank": rdRank,
        "suit": rdSuit
      });
    }
  }

  return rHand;

}

poker.getHand = function (hand) {
  var result = {
    "handString": null,
    "error": null
  },

  handRanks = hand.map(function(card){
    return card.rank;
  }),

  handSuits = hand.map(function(card){
    return card.suit;
  });

  var hasPair = poker.containsPair(ranks, handRanks);
  var hasTwoPair = poker.containsTwoPair(ranks, handRanks);
  var hasThreeOfKind = poker.containsTreeOfaKind(ranks, handRanks);
  var hasFourOfaKind = poker.containsFourOfaKind(ranks, handRanks);
  var hasFullHouse = poker.containsFullHouse(ranks, handRanks);
  var hasStraigth = poker.containsStraigth(ranks, handRanks);
  var hasFlush = poker.containsFlush(suits, handSuits);
  var hasStraigthFlush = poker.containsStraigthFlush(ranks, handRanks, suits, handSuits);
  var hasRoyalFlush = poker.containsRoyalFlush(ranks, handRanks, suits, handSuits);

  if (hasRoyalFlush) {
    result.handString = "Royal Flush";
    return result;
  }

  if (hasStraigthFlush) {
    result.handString = "Straigth Flush";
    return result;
  }

  if (hasFlush) {
    result.handString = "Flush";
    return result;
  }

  if (hasStraigth) {
    result.handString = "Straigth";
    return result;
  }

  if (hasFullHouse) {
    result.handString = "FullHouse";
    return result;
  }

  if (hasFourOfaKind) {
    result.handString = "FourOfaKind";
    return result;
  }

  if (hasThreeOfKind) {
    result.handString = "ThreeOfaKind";
    return result;
  }

  if (hasTwoPair) {
    result.handString = "TwoPair";
    return result;
  }

  if (hasPair) {
    result.handString = "Pair";
    return result;
  }

  result.handString = "Higth Card!";
  return result;

};

poker.containsPair = function (ranks, handRanks) {
    var result = false;

    ranks.forEach(function (rank){
      if (containsNTimes(handRanks, rank, 2)) {
        result = true;
      }
    })
    return result;
}

poker.containsTreeOfaKind = function (ranks, handRanks) {
  var result = false;

  ranks.forEach(function (rank){
    if (containsNTimes(handRanks, rank, 3)) {
      result = true;
    }
  })
  return result;
};

poker.containsFourOfaKind = function (ranks, handRanks) {
  var result = false;

  ranks.forEach(function (rank){
    if (containsNTimes(handRanks, rank, 4)) {
      result = true;
    }
  })
  return result;
};

poker.containsTwoPair = function (ranks, handRanks) {
  var count = 0;
  ranks.forEach(function (rank){
    if (containsNTimes(handRanks, rank, 2)) {
      count++;
    }
  });
  return (count > 1);
}

poker.containsFullHouse = function (ranks, handRanks) {
  var result = false,
      result2 = false,
      rankA = null;

  ranks.forEach(function (rank){
    if (containsNTimes(handRanks, rank, 3)) {
      result = true;
      rankA = rank;
    }
  });
  if ((result) && (rankA !== null)) {
    ranks.forEach(function (rank){
      if (rank !== rankA) {
        if (containsNTimes(handRanks, rank, 2)) {
          result2 = true;
        }
      }
    });
  }

  return (result2 && result);
}

poker.containsStraigth = function (ranks, handRanks) {
  if (!poker.containsPair(ranks, handRanks)) {
    var maiorMenor = [];
    for (var j in handRanks) {
      for (var i in ranks) {
          if (ranks[i] == handRanks[j]) {
            maiorMenor.push({
              "key": ranks[i],
              "value": i
            });
          }
      }
    }
    maiorMenor.sort(function(a, b){ return (a.value - b.value);});
    return ((maiorMenor[4].value - maiorMenor[0].value) == 4);
  }
  return false;
}

poker.containsFlush = function (suits, handSuits) {
  var result = false;

  suits.forEach(function (suit){
    if (containsNTimes(handSuits, suit, 5)) {
      result = true;
    };
  });

  return result;
}

poker.containsStraigthFlush = function (ranks, handRanks, suits, handSuits) {
  return (poker.containsFlush(suits, handSuits) && poker.containsStraigth(ranks, handRanks));
}

poker.containsRoyalFlush = function (ranks, handRanks, suits, handSuits) {
  var ace = false,
      ten = false;
  if (poker.containsStraigthFlush(ranks, handRanks, suits, handSuits)) {
    handRanks.forEach(function (rank) {
      if (rank == "ace") {
        ace = true;
      } else if (rank == "ten") {
        ten = true;
      }
    });
    return (ace && ten);
  }
  return false;
}

module.exports = poker;

//console.log(containsStraigthFlush());
