var child_process=require('child_process');
var iconv=require('iconv-lite');
var BufferHelper = require('bufferhelper');
child = child_process.spawn('ping', ['192.168.137.111','-n','1','-w','2000']);
var bufferHelper = new BufferHelper();
child.stdout.on('data', function(data) {
	 if(data)bufferHelper.concat(data);
});
child.stdout.on('end', function(data) {
	 if(data)bufferHelper.concat(data);
});
child.on('exit', function(code) {
	 var str = iconv.decode(bufferHelper.toBuffer(), 'gbk');
	 //console.log(str);
});