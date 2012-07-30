
/**
 * @author chenhui.ma
 * @description 将CSS 文件中 图片转换成base64编码
 */

xn.create("tool.ImageSprit",[],function(){
	
	var ImageSprit = function(){
		this._init.apply(this,arguments);
	};
	
	ImageSprit.prototype = {	
		_init:function(file){
			
		},
		/**
		 * 找出所有CSS文件中的背景图片
		 * 基本原理就是匹配background-*:url(*);
		 * @param cssString
		 */
		_findBackgroundImage:function(cssString){
			
		},
		/**
		 * 获取对应的图片文件
		 * @param imagePath 图片文件的相对路径，或者绝对路径
		 * @return position 返回图片在合成之后图片的位置
		 */
		_getImageFile:function(imagePath){
			var postion ={
					x:0,
					y:0
			};
			return postion;
		},
		/**
		 * 接收 css 文件File对象
		 * @param file
		 * @return resultFile 转换之后的File对象
		 */
		tranform:function(file){
			
			return resultFile;
		},
		test:function(cssString){
			//分解成每个{}，然后按;分解，然后逐行分析
			var classsA =  cssString.match(/[^{}]*{[^}]*}/gi);
			var resultArray = new Array();

			var length = classsA.length;
			while(length--){
				var classTemp = classsA[length];
			

				var urlA = classTemp.match(/(background|background-image):url\([^};]*\)[^;]*;/gi);
				var len = urlA.length;
				while(len--){
					var tempURL = urlA[len];
					//获取其中的URL;
					var url = tempURL.match(/url\([^};]*\)/gi);

				
					var imagePath = url[0].substring(4,url[0].length-1);
					
					resultArray.unshift(this._replaceBackgroundURL(tempURL,{x:0,y:0,imagePath:imagePath}));
					
				}
				
			}
			console.log(resultArray.join(""));
			console.log(cssString==resultArray.join(""));
			return resultArray;

		},
		/**
		 * 替换bgString 中的URL，并调整background position;
		 * @param bgString
		 * @param position
		 * @returns 替换之后的bgImage
		 */
		_replaceBackgroundURL:function(bgString,position){
			console.log(bgString);
			//判断字符串中是否含有
			var position = bgString.match(/background:url\([^)]*\)\s{1}(\d|\w)*\s{1}(\d|\w)*/gi);
			if(position!=null){
				position = position[0].match(/\s{1}(\d|\w)*\s{1}(\d|\w)*/gi);
			}
			console.log(position);
			return bgString.replace(/\s{1}(\d|\w)*\s{1}(\d|\w)*/gi," $1% $2%");

		}
	};
	return ImageSprit;
});