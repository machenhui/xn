xn.create("videoPlayer.Filesystem",null,function(){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.BlobBuilder = window.WebKitBlobBuilder;
	var fileSystem=null;
	
	
	function _createFile(fileName,success,error){
		fileSystem.root.getFile(fileName, {}, function(fileEntry) { 
			 console.log("file====="+fileEntry.name);
			 success(fileEntry);
		  }, function(e){
			  console.error("打开文件异常");
			  fileSystem.root.getFile(fileName, {create: true, exclusive: true}, function(fileEntry) {

					 console.info(fileEntry.name);
					 success(fileEntry);
				  }, function(e){
					  
					  alert("创建文件失败");
				  });
		  });
		
	}
	
	function saveFile(file,success,error){
		window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs){
			console.info("filesystem:http://"+fs.name.replace(":","/").toLowerCase());
			fileSystem = fs;
			_createFile(file.name,function(fileEntry){
				 wirteFile(fileEntry,file,success,error);
			},opt_errorCallback);
			
		}, opt_errorCallback);
		
	}
	
	function getFile(file,success,error){
		window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs){
			if(file==null){
				//获取所有文件
				success(fs.root);
			}else{
				_createFile(file.name,function(fileEntry){
					success(fileEntry);
				},opt_errorCallback);
			}
			
			
		}, opt_errorCallback);
		
	}
	
	
	function wirteFile(fileEntry,file,success,error){
		
		// Create a FileWriter object for our FileEntry (log.txt).
	    fileEntry.createWriter(function(fileWriter) {

	      fileWriter.onwriteend = function(e) {
	        console.log('Write completed.');
	      };

	      fileWriter.onerror = function(e) {
	        console.log('Write failed: ' + e.toString());
	      };

	      // Create a new Blob and write it to log.txt.
	     /* var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
	      bb.append('Lorem Ipsum');
	      fileWriter.write(bb.getBlob('text/plain'));*/
	      fileWriter.write(file);
	      success(file);
	    }, opt_errorCallback);
		
		
	}
	
	
	function readFile(fileEntry){
		// Get a File object representing the file,
	    // then use FileReader to read its contents.
	    fileEntry.file(function(file) {
	       var reader = new FileReader();

	       reader.onloadend = function(e) {
	         var txtArea = document.createElement('textarea');
	         txtArea.value = this.result;
	         document.body.appendChild(txtArea);
	       };

	       reader.readAsText(file);
	    }, opt_errorCallback);
		
	}
	
	function opt_errorCallback(e){
		  var msg = '';

		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };

		  console.log('Error: ' + msg);
	}
	
	
	
	return {
		saveFile:saveFile,
		getFile:getFile
	}
});