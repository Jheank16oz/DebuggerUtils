var mysql = require("mysql");

var con = mysql.createConnection({
  host: "192.168.11.114",
  user: "root",
  password: "tmp1234"
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query("SELECT * from co_pruebas_soaang_temporal.asistencia_ubigeo_proveedor WHERE IDASISTENCIA = 289435", function (err, result) {
//       if (err) throw err;
//       console.log("Result: " + JSON.stringify(result));

//     });
// });


var express = require("express")
var app = express()
// get all todos
app.get('/obtener/:id', (req, res) => {
  console.dir(req.params);
  console.dir(req.params);

    con.connect(function(err) {
      if (err) console.log(err) 
      con.query("SELECT * from co_pruebas_soaang_temporal.asistencia_ubigeo_proveedor_concluidas WHERE IDASISTENCIA = " + req.params.id, function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
        res.status(200).send(result)

      });
  });
});


app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/app.js');
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