// server returns hash from current timestamp
//
// accepted values:
// hash = md5 | sha1
// type = plain | json
//
// example request with cURL: curl -sS 'http://localhost:8080?hash=md5&type=json'

var http = require('http');
var crypto = require('crypto');

http.createServer(function(req, res) {
  var get = {};
  var reqString = req.url.substring(req.url.indexOf('?') + 1);
  var getParams = reqString.split('&');

  for (var i in getParams) {
    var getParam = getParams[i].split('=');
    get[getParam[0]] = getParam[1];
  }

  if (get.hash && get.type) {
    var time = new Date().getTime().toString();
    var hash;

    switch (get.hash) {
      case 'md5':
      case 'sha1':
        hash = crypto.createHash(get.hash).update(time).digest('hex');
        break;
      default:
        res.end('Wrong hash value');
        return false;
    }

    switch (get.type) {
      case 'json':
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ hash : hash }));
        break;
      case 'plain':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(hash);
        break;
      default:
        res.end('Wrong type value');
        return false;
    }

  } else {
    res.end();
  }
}).listen(8080);
