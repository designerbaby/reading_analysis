var http = require('http');     //加载http模块
var cheerio = require('cheerio');  //加载cheerio模块
var url = 'http://www.imooc.com/learn/348'  //声明url

function fileterChapters(html){
	var $ = cheerio.load(html);      //通过cheerio模块将获得的html文件转载进来

	var chapters = $('.chapter'); //通过cheerio将每一章进行遍历

	// [{
	// 	chapterTitle : '',
	// 	videos: [
	// 		title: '',
	// 		id: '',
	// 	]
	// }]获得数据的结构
	var courseData = []      //声明一个课程用于存放课程数据

	chapters.each(function(item) {
		var chapter = $(this)   //获得单独的某一章
		var chapterTitle = chapter.find('strong').text();  //找到strong的标签将文本内容拿出来

		var videos = chapter.find('.video').children('li');//找到video的ul  ul下的li
		var chapterData = {
			chapterTitle: chapterTitle,
			videos:[]
		}

		videos.each(function(item){
			var video = $(this).find('.studyvideo');//通过video的类名获取这个video
			var videoTitle = video.text();
			var id = video.attr('href').split('video/')[1];

			chapterData.videos.push({
				title:videoTitle,
				id:id,
			})
		})
		courseData.push(chapterData);
	})
	return courseData;
}

function printCourseInfo(courseData){
	courseData.forEach(function(item){
		var chapterTitle = item.chapterTitle;     //取得chapterTitle的标题

		console.log(chapterTitle + '\n');    //并将每一章的标题打印出来

		item.videos.forEach(function(video){
			console.log('  [' + video.id + ']' + video.title + '\n');
		})
	})
}

http.get(url, function(res) {   //用http获取url，并且用方法进行处理
	var html = '';            
	res.on('data',function(data){
		html +=data;              //用on方法，将获取的数据放到on里面去
	})

	res.on('end', function(){     //获取数据完毕后进行数据处理
		var courseData = fileterChapters(html);//通过filterChapters方法获取courseData的数据
		printCourseInfo(courseData);
	})
}).on('error', function(){
	console.log("获取课程数据失败");     //绑定事件，当获取数据失败后就弹出这个。
})
