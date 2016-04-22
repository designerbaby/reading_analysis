var http = require('http'),
	httpProxy = require('http-proxy');

//新建一个代理Proxy Server对象
var proxy = httpProxy.createProxyServer({});

//获取异常
proxy.on('error', function(err,req,res){
	res.writeHead(500,{
		'Content-Type':'text/plain'
	});
	res.end('Something went wrong.');
});

var server = require('http').createServer(function(req,res){
	var host = req.url;
	host = url.parse(host);
	host = host.host;
	console.log("host:" +req.headers.host);
	console.log("client ip:" + (req.headers['x-forwarded-for'] || req.connection.remoteAddress));
	proxy.web(req,res,{target: 'http://localhost:8080'});
	console.log("listening on port 80")
	server.listen(80);
});