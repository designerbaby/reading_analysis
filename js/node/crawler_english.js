var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.en998.com/sentence/'

function fileter_data(html){
	var $ = cheerio.load(html);
	var left_content = $(".left_con");//获取到左边的dom结构
	//console.log(left_content);
	// [{
	// 	contentTitle : '',
	// 	content: '',
	// }]获得数据的结构
	var content_data = [];

	left_content.each(function(item){
		var one_content = $(this);
		var one_content_title = one_content.find('strong:first').text();//获取strong这个数据
		console.log(one_content_title);
	});
}

http.get(url, function(res) {
	var html = '';
	res.on('data',function(data){
		html +=data
	})

	res.on('end', function(){
		var analysis_data = fileter_data(html);

	})
}).on('error', function(){
	console.log("获取数据失败");
})
