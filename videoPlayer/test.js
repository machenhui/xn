xn.use(["videoPlayer.Filesystem"],function(FileSystem){
	var inputs=document.querySelectorAll("input");
	var video = document.querySelector("video");
	var music_title = document.querySelector("#music_title");
	window.URL=window.webkitURL||window.URL;
	for(var i = inputs.length;i>0;i--){
		var input = inputs[i-1];
		
		input.addEventListener("change",function(event){
			var files=event.currentTarget.files;

			//music_title.innerHTML=examples.simple.filelist({filelist:[{name:file.name}]});
			
			for(var i = files.length;i>0;i--){
				var file = files[i-1];
				file.url=window.URL.createObjectURL(file);
				
			}
			music_title.innerHTML=examples.simple.filelist({filelist:files});
			FileSystem.saveFile(files[0],function(fileEntery){
				console.log(fileEntery);
			});
			
			//playVideo(window.URL.createObjectURL(files[0]));
		},false);
	}
	music_title.addEventListener("click",function(event){
		var fileURL=event.target.getAttribute("_href");
		if(fileURL!=null){
			playVideo(fileURL);
		}
		
	},false)
	//播放第一首音乐
	function playVideo(fileURL){
	
		video.src=fileURL;
		video.play();		
	}
	
	FileSystem.getFile(null,function(fileEntery){
		console.log("getFile");
		console.log(fileEntery);
	});
});
