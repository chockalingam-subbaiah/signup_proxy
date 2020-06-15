var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var urlExists = require('url-exists');
var apiProxy = httpProxy.createProxyServer({secure: false});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
    if(req.body) {
          let bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type','application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
});

app.use(function(req, res) {
      let host = JSON.parse(JSON.stringify(req.body))['misc']['domain']; 
      console.log(host);
      var targetEndpoint = "https://" + host;
      urlExists(targetEndpoint, function(err, exists) {
                targetEndpoint = exists? targetEndpoint : "https://seafarersstaging3.freshpo.com";  
                req.headers['host'] = exists? host : "seafarersstaging3.freshpo.com" ;
                apiProxy.web(req, res, {target: targetEndpoint});
            });
});
app.listen(3000);
