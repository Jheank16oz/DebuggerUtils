var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.11.114",
  user: "root",
  password: "tmp1234"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * from co_pruebas_soaang_temporal.asistencia_ubigeo_proveedor WHERE IDASISTENCIA = 289435", function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));

    });
});