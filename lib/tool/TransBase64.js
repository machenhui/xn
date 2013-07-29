/**
 * 负责将多张图片合并成一个，并返回对应的CSS
 */
xn.create("tool.TransBase64",["loader_test.Extend"],function(Extend){
	
	var TransBase64 = function(){
		this._init.apply(this,arguments);
	};
	
	TransBase64.prototype = {	
		_init:function(options){
			this.options = Extend({
				basePath:"http://t.comicsand.com"
			},options);
		},
		_changeImageToBase64:function(src,successFn,errorFn){
			if(src.search(/^http/i) ==-1){
				src = this.options.basePath + src;
			}
			var image = new Image();
			image.crossOrigin = this.options.basePath;
			image.onload = function(event){
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext('2d');
				canvas.setAttribute("width",image.width+"px");
				
				console.log(image.width);
				canvas.setAttribute("height",image.height+"px");
				console.log(image.height);
				ctx.drawImage(image,0,0,image.width,image.height);/**/
				
				var imageData = ctx.getImageData(0, 0, image.width,image.height);
				
				/*showImage.src=canvas.toDataURL("png");
				console.log(showImage.width);*/
			
				if(successFn)
					successFn(canvas.toDataURL("png"));
					
			};
			image.onerror = function(event){
				if(errorFn)
					errorFn(event);
			};
			image.src = src;
		},
		_transCSSString:function(cssString,successFn,errorFn){
			var self = this;
			var url = cssString.match(/url\([^)]*[.png]\)/i);
			
			if(url!=null){
				var path = url[0].substring(4,url[0].length-1);
				this._changeImageToBase64(path,function(data){
					
					cssString = cssString.replace(url[0],"url("+data+")");
					self._transCSSString(cssString,successFn,errorFn);
				},function(event){
					console.error(event);
				});
				
			}else{				
				if(successFn)
					successFn(cssString);
			}
			
		},
		test:function(cssString,successFn,errorFn){
			this._transCSSString(cssString, successFn, errorFn);
			
		}
	};
	return TransBase64;
});