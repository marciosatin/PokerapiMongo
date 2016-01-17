var express = require("express"),
    bodyParser = require("body-parser"),
    http = require("http"),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

http.createServer(app).listen(process.env.PORT || 3000);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var contatos = [
  {id: "1", nome: "Pedro", telefone: "9999999900", data: new Date(), operadora: {nome: "Oi", codigo: "14", categoria: "Celular"}},
  {id: "2", nome: "Ana", telefone: "9999999911", data: new Date(), operadora: {nome: "Tim", codigo: "41", categoria: "Celular"}},
  {id: "3", nome: "Maria", telefone: "9999999922", data: new Date(), operadora: {nome: "Vivo", codigo: "15", categoria: "Celular"}}
];

var operadoras = [
  {nome: "Oi", codigo: "14", categoria: "Celular", preco: 2},
  {nome: "Vivo", codigo: "15", categoria: "Celular", preco: 1},
  {nome: "Tim", codigo: "41", categoria: "Celular", preco: 3},
  {nome: "Embratel", codigo: "21", categoria: "Fixo", preco: 2},
  {nome: "Gvt", codigo: "25", categoria: "Fixo", preco: 4}
];

app.get("/contatos", function (req, res){
  res.json(contatos);
});

app.get("/detalhesContato/:id", function (req, res) {
  res.json(contatos.filter(function(contato){
    return contato.id == req.params.id;
  }));
});

app.get("/operadoras", function (req, res){
  res.json(operadoras);
});

app.post("/contato", function (req, res){
  console.log(req.body);
  contatos.push(req.body);
  res.json(true);
});
