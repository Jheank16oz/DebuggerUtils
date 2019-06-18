var mysql = require("mysql");
var server = require("./server");
var configuration = require("./configuration");
var express = require("express")


var app = express()
//const ngrok = require('ngrok');

var con = mysql.createConnection({
  host: configuration.settings.mysql[0].host,
  user: configuration.settings.mysql[0].username,
  password: configuration.settings.mysql[0].password
});

var conProduction = mysql.createConnection({
  host: configuration.settings.mysql[1].host,
  user: configuration.settings.mysql[1].username,
  password: configuration.settings.mysql[1].password
});



// get all 
app.get('/obtener/:environment/:country/:id', (req, res) => {
    var environmentString = req.params.environment
    var currentConection = con;
    if(environmentString == "produccion"){
      currentConection =  conProduction;
      environmentString = "";

    }else{
      environmentString += "_";
    }
    
    currentConection.connect(function(err) {
      if (err) console.log(err) 
      var query = "SELECT * from " + req.params.country + "_" + environmentString + "soaang_temporal.asistencia_ubigeo_proveedor_concluidas WHERE IDASISTENCIA = " + req.params.id;
      currentConection.query(query, function (err, result) {
        if (err) console.log(err);
        res.status(200).send(result)

      });
  });
});

app.get('/info/:environment/:country', (req, res) => {
  var environmentString = req.params.environment
  var currentConection = con;
  if(environmentString == "produccion"){
    currentConection =  conProduction;
    environmentString = "";

  }else{
    environmentString += "_";
  }
  
  currentConection.connect(function(err) {
    if (err) console.log(err) 
    var query = "SELECT * from login_email.configuracion_pais WHERE PAIS ='" + req.params.country+"'";
    currentConection.query(query, function (err, result) {
      if (err) console.log(err);
      res.status(200).send(result)

    });
});
});

// start page
app.get('/changeEnvironment/:env', function (req, res) {
  server.changeEnvironment(req, res)
});

// start page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/logger', function (req, res) {
  res.sendFile(__dirname + '/logger/index.html');
});

app.get('/tracking', function (req, res) {
  res.sendFile(__dirname + '/tracking/index.html');
});

// files access
app.get('/logger/app', function (req, res) {
  res.sendFile(__dirname + '/logger/app.js');
});

app.get('/app/style', function (req, res) {
  res.sendFile(__dirname + '/app/style.css');
});

app.get('/logger/style', function (req, res) {
  res.sendFile(__dirname + '/logger/style.css');
});

app.get('/tracking/style', function (req, res) {
  res.sendFile(__dirname + '/tracking/style.css');
});

app.get('/tracking/map', function (req, res) {
  res.sendFile(__dirname + '/tracking/map.js');
});

app.get('/tracking/app', function (req, res) {
  res.sendFile(__dirname + '/tracking/app.js');
});

app.get('/logs/:query*?', function (req, res) {
  server.log(req, res)
});

app.get('/log/:lines/:filename*?', function (req, res) {
  server.getLogByName(req, res)
});

app.get('/connection.js', function (req, res) {
  res.sendFile(__dirname + '/connection.js');
});

app.get('/proveedor/style', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/style.css');
});

app.get('/proveedor', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/index.html');
});

app.get('/proveedor/app', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/app.js');
});

app.get('/proveedor/app', function (req, res) {
  res.sendFile(__dirname + '/proveedor_logger/app.js');
});

app.use('/static', express.static(__dirname + '/node_modules'));




const PORT = 5000;

const ngrok = require('ngrok');
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);

});


