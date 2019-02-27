/*var node_ssh, ssh
node_ssh = require('node-ssh');*/

var Client = require('ssh2').Client
var configuration = require('./configuration')

var conn = new Client()
conn.on('ready', function () {
  console.log('Client :: ready')
}).connect({
  host: configuration.settings.mysql[0].host,
  username: configuration.settings.mysql[0].username,
  password: configuration.settings.mysql[0].password
})

module.exports = {
  log: function logger (req, res) {
    var filter = "ls -m  /var/www/html/ws_vs2/app/*.log | awk -F/ '{print $NF}'"
    var query = req.params.query
    if (query != undefined && query.length > 0) {
      filter += ' | grep ' + query + ''
    }
    conn.exec(filter, function (err, stream) {
      var result = ''
      if (err) {
        res.status(500).send(err)
        return
      }
      stream.on('close', function (code, signal) {
        res.status(200).send(result)
      }).on('data', function (data) {
        result += data
      }).stderr.on('data', function (data) {
        result = data
      })
    })
  },
  getLogByName: function logger (req, res) {
    if (req.params.filename == undefined) {
      res.status(404).send('No se encontraron resultados')
      return
    }
    var command = 'timeout 10s tail -' + req.params.lines + ' /var/www/html/ws_vs2/app/' + req.params.filename + ' | awk \'{print NR-0 " " $0}\''

    conn.exec(command, function (err, stream) {
      var result = ''
      if (err) {
        res.status(500).send(err)
        return
      }
      stream.on('close', function (code, signal) {
        res.status(200).send(result)
      }).on('data', function (data) {
        result += data
      }).stderr.on('data', function (data) {
        result = data
      })
    })
  }
}
