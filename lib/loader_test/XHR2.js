xn.create("loader_test.XHR2",["loader_test.Extend"],function(extend){
	
	var xhr2 = function(){
	   this._init.apply(this,arguments);	
	};
	xhr2.prototype={
			_init:function(options){
				//重写options
				this.options=extend({
					withCredentials:true,
					isSetCustomeHeader:true
				},options);
				var data=null;
				data=this.changeParam(this.options.data);
				if(data!=null&&data!=""&&this.options!=null&&this.options.method!=null&&this.options.method.toLowerCase()=="get"){
					if(this.options.url.search(/\?/gi)==-1){
						this.options.url+="?"+data;
					}else{
						this.options.url+="&"+data;
					}
					
				}
	            //创建XHR 对象
			   this._create(this.options.method,this.options.url);
			   this._bind();
		       if (this.xhr==null) {
			       throw new Error('CORS not supported');
			       return null;
		       }
		       
		       //发送数据
		       if(this.options!=null&&this.options.method!=null&&this.options.method.toLowerCase()=="post"){
		    	   
		    	   this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		       }else{
		    	   data=null;
		       }
		       
		       if(this.options.isSetCustomeHeader==true){
		    	   console.log("添加自定义header");
		    	   this.xhr.setRequestHeader("X-Custom-Header","ccc");
		       }
		       
		       this.xhr.send(data);
		    	   
			},
			_bind:function(){
				var self=this;
				this.xhr.addEventListener("load", function(event) {
					self._success(event.currentTarget);
				}, false);
				
				this.xhr.addEventListener("error", function(event) {
					self._failure(event);
				}, false);
				
				this.xhr.addEventListener("timeout", function(event) {
					self._failure(event);
				}, false);
			},
			_create:function(method,url){
				var xhr = new XMLHttpRequest();
				  if ("withCredentials" in xhr) {
					  
				    xhr.open(method, url, true);
				    xhr.withCredentials= this.options.withCredentials;
					console.log(xhr.withCredentials);

				  } else if (typeof XDomainRequest != "undefined") {

				    xhr = new XDomainRequest();
				    xhr.open(method, url);

				  } else {				   
				    xhr = null;
				  }
				  
				  this.xhr = xhr;				
			},
			_success:function(response){
				var responseText = this.xhr.responseText;
				if(this.options.format=="xml"){
					
					this.options.success(this.xhr.responseXML,this.xhr,this.options);	
				}else{
					this.options.success(JSON.parse(responseText),this.xhr,this.options);	
				}
							
			},
			_failure:function(error){
				this.options.failure(error);
				alert(JSON.stringify(error));
				console.error("发生异常"+JSON.stringify(error));
			},
			changeParam:function(param){
				var result = Array();
				for (var i in param){
					result.push(i+"="+param[i]);
				}
				
				return result.join("&");
			}
	};
	
	return xhr2;
});