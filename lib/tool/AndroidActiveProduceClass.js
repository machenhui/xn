/**
 * 将 css文件中的:active 转化成 .active
 */
xn.create("tool.AndroidActiveProduceClass",["loader_test.Extend","loader_test.MD5"],function(Extend,MD5){
	
	
	var TransActive = function(){
		this._init.apply(this,arguments);
	};
	
	TransActive.prototype = {
			_init:function(){
				this.cssReplaceMap == null?this.cssReplaceMap = {}:this.cssReplaceMap;
				this.cssRepeatMap == null?this.cssRepeatMap = {}:this.cssRepeatMap;
			},
			_rmoveClassNameRepeat:function(cssString){
				//找到ClassName	
				var cssNameArray = cssString.match(/}[^{|}]*{/gi);
				var ifrstClassName = cssString.match(/[^{|}]*{/i);
				
				for(var i in this.cssReplaceMap){
					var testA = new RegExp("}[^{|}]*"+this.cssReplaceMap[i].replace("{","").replace(/\./gi,"\\.").replace(/\[/gi,"\\[")+"[^{|}]*{","i");
					
					var className = cssString.match(testA);
					if(className == null){

						console.log("没找到");
						
					}else{
						console.log("去除重复");
						var classList = className[0].split(",");
						var tempObj = {};
						var tempArray = [];
						var len = classList.length;
						
						while(len--){
							classList[len] = classList[len].replace(/\s{1}/gi," ").replace(/({|})/gi,"").replace(/^\s*/gi,"");
							tempObj[classList[len]]=classList[len];
						}
						
						for(var i in tempObj){
							tempArray.push(i);
						}
						
						var tempResult = "";
						if(className[0].search("}")-1){
							tempResult="}"+tempArray.join(", ")+"{";
						}
						this.cssRepeatMap[className[0]] = tempResult;
					}
						
				}
				for(var i in this.cssRepeatMap){
					cssString = cssString.replace(i,"<span class='red'>"+this.cssRepeatMap[i]+"</span>");

				}
				
				return cssString;
			},
			/**
			 * 解析CSS 文件中的@media
			 * @param cssString
			 * @param successFn
			 * @param errorFn
			 * @returns
			 */
			_tansMedia:function(cssString,successFn,errorFn){
				//匹配所有的@media
				
				var medias = cssString.match(/@media\s{1}[^{|}]*{+\.*+}[\r|\n|\t|\s]*}/i);
			},
			trans:function(cssString,successFn,errorFn){
				/**
				 * 使用正则转换
				 */
				
				var mA = cssString.match(/[^,|{|}]*\:active[^,|{]*[,|{]/i);
				if(mA!=null){
					var cssStrT = mA[0];
					var cssStrT1 = cssStrT.replace(/:active/gi,".active");
					var resultStr = "";
					if(cssStrT.search("{")!=-1){
						resultStr = cssStrT1.replace("{",", ")+cssStrT;
					}else{
						resultStr = cssStrT1+" "+cssStrT;
					}
										
					var newKey = MD5(cssStrT)+parseInt(Math.random()*1000000);
					
					this.cssReplaceMap[newKey] = resultStr.substring(0,resultStr.length-1);
					cssString = cssString.replace(cssStrT,"@@"+newKey+"@@"+resultStr.substring(resultStr.length-1));
					
					this.trans(cssString, successFn, errorFn);
				}else{
					for(var i in this.cssReplaceMap){
						cssString = cssString.replace("@@"+i+"@@",this.cssReplaceMap[i]);
					}
					cssString = this._rmoveClassNameRepeat(cssString);
					successFn(cssString);
				}
				
				return cssString;
			},
			transF:function(cssString,successFn,errorFn){
				this._tansMedia(cssString, successFn, errorFn);
				/**
				 * 使用正则转换
				 */
				var mA = cssString.match(/[^,|{|}]*\.active[^,|{]*[,|{]/i);
				
				if(mA!=null){
					var cssStrT = mA[0];
					var cssStrT1 = cssStrT.replace(/\.active/gi,":active");
					
					var resultStr = "";
					if(cssStrT.search("{")!=-1){
						resultStr = cssStrT1.replace("{",", ")+cssStrT;
					}else{
						resultStr = cssStrT1+" "+cssStrT;
					}
										
					var newKey = MD5(cssStrT)+parseInt(Math.random()*1000000);
					this.cssReplaceMap[newKey] = resultStr.substring(0,resultStr.length-1);
					cssString = cssString.replace(cssStrT,"@@"+newKey+"@@"+resultStr.substring(resultStr.length-1));
					
					this.transF(cssString, successFn, errorFn);
				}else{
					for(var i in this.cssReplaceMap){
						
						cssString = cssString.replace("@@"+i+"@@",this.cssReplaceMap[i]);
					}
					cssString = this._rmoveClassNameRepeat(cssString);
					successFn(cssString);
				}
				
				return cssString;
			}
	};
	
	return TransActive;
});