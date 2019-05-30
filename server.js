/*var node_ssh, ssh
node_ssh = require('node-ssh');*/

var Client = require('ssh2').Client
var configuration = require('./configuration')
var indexSSH = 0
var conn = new Client()
conn.on('ready', function () {
  console.log('Client :: ready')
}).connect({
  host: configuration.settings.ssh[indexSSH].host,
  username: configuration.settings.ssh[indexSSH].username,
  password: configuration.settings.ssh[indexSSH].password
})

var path = configuration.settings.ssh[indexSSH].path

module.exports = {
  changeEnvironment: function change (req, res) {
    conn.end()
    conn = new Client()
    indexSSH = req.params.env == 'release' ? 1 : 0
    
    var currentConfiguration = configuration.settings.ssh[indexSSH]
    path = currentConfiguration.path
    conn.on('ready', function () {
      res.status(200).send('change ready ' + currentConfiguration.type)
      console.log('Client :: ready ' + currentConfiguration.type)
    }).connect({
      host: currentConfiguration.host,
      username: currentConfiguration.username,
      password: currentConfiguration.password
    })
  },
  log: function logger (req, res) {
    var filter = 'ls -m  ' + path + "*.log | awk -F/ '{print $NF}'"
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
    console.log(req.params.filename);
    if (req.params.filename == 'undefined') {
      res.status(404).send('No se encontraron resultados')
      return
    }
    var command = 'timeout 10s tail -' + req.params.lines + ' ' + path + req.params.filename + ' | awk \'{print NR-0 " " $0}\''


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
