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
  getEnvironments: function environments(res){
    if(configuration.settings.ssh.length > 0){
      var json = []
      var index = 0;
      configuration.settings.ssh.forEach(ssh => {
        json.push({
          id:index,
          name:ssh.name,
          url:ssh.host          
        })
        index++;
      });
      res.status(200).send(json)      

    }else{
      res.status(403).send('Configurations are empty')      
    }
  },
  changeEnvironment: function change (req, res) {
    conn.end()
    conn = new Client()
    console.log('env index changed :'+req.params.env)
    indexSSH = req.params.env
    
    var currentConfiguration = configuration.settings.ssh[indexSSH]
    path = currentConfiguration.path
    try{
      conn.on('ready', function () {
        res.status(200).send('change ready ' + currentConfiguration.host)
        console.log('Client :: ready ' + currentConfiguration.host)
      }).connect({
        host: currentConfiguration.host,
        username: currentConfiguration.username,
        password: currentConfiguration.password
      })
    }catch(e){
      res.status(403).send('conecction error')
    }
  },
  log: function logger (req, res) {
    console.log(path)
    var filter = 'ls -m ' + path + " | awk -F/ '{print $NF}'"
    var query = req.params.query
    if (query != undefined && query.length > 0) {
      filter += ' | grep ' + query + ''
    }
    console .log(filter)
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
        
      })
    })
  },
  getLogByName: function logger (req, res) {
    console.log(req.params.filename);
    if (req.params.filename == 'undefined') {
      res.status(404).send('No se encontraron resultados')
      return
    }
    var command = 'timeout 10s tail -' + req.params.lines + ' ' + path + req.params.filename + ' '

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
        //result = data
      })
    })
  }
}
