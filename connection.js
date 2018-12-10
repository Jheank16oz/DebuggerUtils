var mysql = require("mysql");

var con = mysql.createConnection({
  host: "192.168.11.114",
  user: "root",
  password: "tmp1234"
});

var conProduction = mysql.createConnection({
  host: "192.168.11.210",
  user: "soaang_replica",
  password: "Concentra_2017"
});

var express = require("express")
var app = express()
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
        console.log("Result: " + result.sqlMessage);
        if (err) console.log(err);
        console.log("Result: " + JSON.stringify(result));
        res.status(200).send(result)

      });
  });
});

// files access
app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/app.js');
});

app.get('/styles.css', function (req, res) {
  res.sendFile(__dirname + '/styles.css');
});

app.get('/map.js', function (req, res) {
  res.sendFile(__dirname + '/map.js');
});

app.get('/connection.js', function (req, res) {
  res.sendFile(__dirname + '/connection.js');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});