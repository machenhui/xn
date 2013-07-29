/**
 * 将一个Blob,或者一个File 对象保存到本地，并返回文件地址
 */
xn.create("tool.SaveFile",["loader_test.Extend"],function(Extend){
	
	var SaveFile = function(){
		this._init.apply(this,arguments);
	};
	
	SaveFile.prototype = {	
		_init:function(options){
			var self = this;
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, function(fs){
				self._successFn(fs);
			},function(e){
				self._errorFn(e);
			});
		},
		_successFn:function(fs){
			this.fs = fs;
			console.log('Opened file system: ' + fs.name);
		},
		_errorFn:function(e){
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
		},
		_createFile:function(file,successFn,errorFn){
			var self = this;
			this.fs.root.getFile(file.name, {create: true, exclusive: true}, function(fileEntry) {

				 // Create a FileWriter object for our FileEntry (log.txt).
			    fileEntry.createWriter(function(fileWriter) {

			      fileWriter.onwriteend = function(e) {
			        console.log('Write completed.');
			        if(successFn)
			        	successFn(fileEntry.toURL());
			      };

			      fileWriter.onerror = function(e) {
			        console.log('Write failed: ' + e.toString());
			        if(errorFn)
			        	errorFn(e);
			      };

			      fileWriter.write(file);
			      

			    }, self._errorFn);

		  }, function(e){
			 if(errorFn)
				 errorFn(e);
		  });
		},
		saveFile:function(file,successFn,errorFn){
			var self = this;
			this.fs.root.getFile(file.name,{},function(fileEntry){
				if(fileEntry!=null){
					fileEntry.remove(function() {
					      console.log('File removed.');
					      self._createFile(file, successFn, errorFn);
					    }, function(e){
					    	console.error('File removed error');
					    });
				}
				
				
			},function(e){
				 self._createFile(file, successFn, errorFn);
			});
			
		}
	};
	return SaveFile;
});