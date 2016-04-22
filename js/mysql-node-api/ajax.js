var http = require("http")
,url  = require("url")
,path = require("path")
,fs   = require("fs")

var querystring = require("querystring");
var child_process=require('child_process');
var iconv=require('iconv-lite');
var BufferHelper = require('bufferhelper');

var handle=[];
exports.handle=handle;
function objcopy(field,p){
	var obj={};
	for(var i=0;i<field.length;i++)obj[field[i]]=p[field[i]];
	return obj;
}
function Return(res,obj,result){
	if(obj.callback){
		res.writeHead(200, {"Content-Type": "text/javascript"});
		res.end(obj.callback+'('+JSON.stringify(result)+')');
	}else{
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end(JSON.stringify(result));
	}
	throw "";
}
handle["/getdata"]=function(req,res,obj){
	var query=require("./link-mysql.js");
	console.log(obj);
	var page=parseInt(obj.page);
	var pagesize=2;
	if(isNaN(page)){
		page=0;
	}
	var cond="limit "+pagesize+" offset "+(page*pagesize);

	query("select * from ir_users "+cond,function(err,vals,fields){
		var result=[];
		if(err)Return(res,obj,result);
		for(var i=0;i<vals.length;i++){
			var val=vals[i];
			result.push({
				User:val.username,
				//Host:val.Host,
				Password:val.password,
			});
		}
		Return(res,obj,result);
	});
}
handle['/ping_windows']=function(req,res,obj){//obj.ip,obj.callback
	console.log(JSON.stringify(obj));
	
	if(obj.ip){
		child = child_process.spawn('ping', [obj.ip,'-n','1','-w','2000']);
		var bufferHelper = new BufferHelper();
		child.stdout.on('data', function(data) {
			 if(data)bufferHelper.concat(data);
		});
		child.stdout.on('end', function(data) {
			 if(data)bufferHelper.concat(data);
		});
		child.on('exit', function(code) {
			 var str = iconv.decode(bufferHelper.toBuffer(), 'gbk');

			 console.log(str);
			 var result={alive:false};
			 if(str.indexOf('已接收 = 1')!=-1)result.alive=true;
			 Return(res,obj,result);
		});
	}else{
		res.end();
	}
}
handle['/ping_linux']=function(req,res,obj){//obj.ip,obj.callback
	//console.log(JSON.stringify(obj));
	
	if(obj.ip){
		var flag={};
		child = child_process.spawn('ping', [obj.ip,'-c','2','-w','2000']);
		var bufferHelper = new BufferHelper();
		function proc_result(){
			if(flag.end=="1" && flag.exit==1){
				 var str = bufferHelper.toBuffer()+"";
				 console.log(str);
				 var result={alive:false};
				 try{
				 	var lostpercent=parseInt(str.split("received, ")[1].split("% packet loss,")[0]);
				 	if(lostpercent<=50)result.alive=true;
				 }catch(e){
				 	Return(res,obj,result);
				 }
				 Return(res,obj,result);
			}
		}
		child.stdout.on('data', function(data) {
			//console.log('data');console.log(data);
			 if(data)bufferHelper.concat(data);
		});
		child.stdout.on('end', function(data) {
			 if(data)bufferHelper.concat(data);
			 flag.end="1";
			 proc_result();
		});
		child.on('exit', function(code) {
			flag.exit="1";
			proc_result();
		});
	}else{
		res.end();
	}
}
