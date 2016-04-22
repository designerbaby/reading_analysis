var query=require("../link-mysql.js");  

query("select * from ir_users",function(err,vals,fields){
	//console.log(err);
	//if(err)return;
	for(var i=0;i<fields.length;i++){
		var field=fields[i];
		console.log(field.name);
	}
console.log(" ");
	for(var i=0;i<vals.length;i++){
		var val=vals[i];
		console.log(val.username);
		//console.log(val.Host);
		console.log(val.password);
	}
});  

