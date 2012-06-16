/**
 * @deprecated 中文转拼音
 */

/**
 * 加载拼音的js 文件，使用全局变量 pin_yin
 */
importScripts("http://mc1.test.renren.com/mlogin/xn_api_test/resource/pinyin_json.js");
var Change = function(){
	this._init.apply(this,arguments);
};

Change.prototype = {
		_init:function(){
			
		},
		/**
		 * 获取拼音的资源文件
		 * @param successFn
		 * @param errorFn
		 */
		_getPinYin:function(successFn,errorFn){
			
		},
		chanage:function(zhString){
			var length = zhString.length;
			
			var result = "";
			while(length--){
				var char = zhString.charAt(length);
				var isFind = false;
				for(var i in pin_yin){
					
					if(pin_yin[i].search(char)!=-1){
						result = " "+i+" "+result;
						isFind = true;
						break;
					}
				}
				/**
				 * 可能是个标点符号
				 */
				if(!isFind)
				    result = char+result;
			}
			return result;
		}
		
};

var change = new Change();

self.onmessage = function(event){
	
	var result = change.chanage(event.data);
	self.postMessage(result);
};


