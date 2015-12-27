var express = require("express"),
    http = require("http"),
    poker = require("./poker.js"),
    mongoose = require("mongoose"),
    app = express();

app.use(express.static(__dirname + "/client"));

//Efetua o parse dos objetos de entrada
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost/pokerapimongo');

var HandSchema = mongoose.Schema(
  {
    "hand": [{}],
    "handString": String
  }
);

var Hand = mongoose.model("Hand", HandSchema);

// Create our Express-powered HTTP server
http.createServer(app).listen(3000);

// set up the root route
app.get("/", function (req, res) {
    res.send("This is the root route!");
});

app.get("/randomHands", function(req, res){
  var rh = poker.randonHand();
  console.log(rh);
  res.json(rh);
});

app.get("/hands", function(req, res){
  Hand.find({}, function(err, hands){
    if (null !== err) {
      console.log("Error:" + err);
    }
    res.json(hands);
  });
});

app.post("/hand", function (req, res) {

    var newHand = new Hand(
      {
        "hand":req.body.hand,
        "handString": null
      }
    );

    Hand.count({}, function(err, c) {
        console.log('Count is ' + c);
        if (c == 15) {
          Hand.remove({}, function (err) {
            if (err) return handleError(res, err);
            // removed!
          });
        }
    });

    var handResult = poker.getHand(req.body.hand);
    if (handResult.error !== null) {
      console.log(handResult);
      res.send(handResult.error);
      return;
    }

    newHand.handString = handResult.handString;

    newHand.save(function (err, result){
      if (null !== err) {
        console.log("Error: " + err);
        res.send("ERROR");
      } else {
          Hand.find({}, function(err, result){
            if (err !== null) {
              console.log("Error: " + err);
              res.send("ERROR");
            }
            res.json(result);
          });
      }
    });

});

function handleError(res, err) {
  return res.send(500, err);
}
