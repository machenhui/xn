xn.create("loader_test.OAuthInner",["loader_test.SHA1","loader_test.XHR2","loader_test.MD5"],function(SHA1,XHR2,MD5){
	    		var Oauth = function(){
	    			
	    			this._init.apply(this,arguments);
	    		};
	    		Oauth.prototype={
	    				apiKey:"b5ab6484748149848cac2614ec1dab65",
	    				secretKey:"2f0f53a034faa1d10b6c3c723a839580",//必须动态获取用户的secretKey
	    				defaultSecretKey:"6fa2e53b5df74895a16dec66358513af",//默认的Key值
	    				appId:"182566",
	    				session_key:"BepsQ8jsE2dqMXEB",
	    				authorizeURL:"https://graph.renren.com/oauth/authorize",
	    				loginSuccessURL:"http://test2.touch.renren.com/html/oauth2.0/LoginSuccess.html",
	    				//apiServerURL:"http://api.renren.com/restserver.do",
	    				apiServerURL:"http://mc1.test.renren.com/mlogin/xn_api_test/api",
	    				//apiServerURL:"http://api.m.renren.com/api",
	    				//apiServerURL:"http://client2.test.renren.com/xn_api/api",
	    				/*apiServerURL:"http://client2.test.renren.com/xn_api/manifest/_static.js",*/
	    				feedType:[102,103,104,107,110,501,502,601,701,702,709,801,1101,1104],
	    			    SCOPE_FIELD:{
	    			    	read_user_blog:"read_user_blog",
	    			    	read_user_checkin:"read_user_checkin",
	    			    	read_user_feed:"read_user_feed",
	    			    	read_user_guestbook:"read_user_guestbook",
	    			    	read_user_invitation:"read_user_invitation",
	    			    	read_user_like_history:"read_user_like_history",
	    			    	read_user_message:"read_user_message",
	    			    	read_user_notification:"read_user_notification"
	    			    },
	    				_init:function(){
	    					//this.checkLogin(function(){});
	    				},
	    				showLoginWindow:function(scope){
	    					
	    					var openWindow=this.authorizeURL+"?client_id="+this.apiKey
	    							+"&response_type=token&redirect_uri="+this.loginSuccessURL+"&scope="+scope.join(" ");
	    					window.open(openWindow,"renrenoauth",null);
	    					
	    					//登录完成之后，要拿到Key值
	    					
	    				},
	    				friendsGet:function(callBack){
	    					
	    					var defaultParam={
	    							'api_key': this.apiKey,
	    							'method':"friends.getFriends", 
	    							'call_id':new Date().getTime(), 
	    							'session_key':this.session_key,//每次必须取登录用户的sessionKey
	    							'v':'1.0',
	    							'format':'json'
	    					}
	    					var tmpA = new Array();
	    					for(var i in defaultParam){
	    						
	    						tmpA.push(i+"="+window.decodeURIComponent(defaultParam[i]).substring(0, 50));
	    					}
	    					
	    					tmpA.sort();//必须进行排序 //要对所有的数据进行升序排列
	    					var sig=MD5(tmpA.join("")+this.secretKey);
	    				
	    					defaultParam.sig=sig;
	    					
	    					tmpA.push("sig="+sig)
	    					var xhr=new XHR2({
	    						url:this.apiServerURL,
	    						method:"post",
	    						data:defaultParam,
	    						success:function(response){
	    							callBack(response);	    							
	    						},
	    						failure:function(response){
	    							alert("请求失败");
	    						}
	    					});
	    				},
	    				checkLogin:function(callBack){
	    					var self=this;
	    					var defaultParam={
	    							'api_key': this.apiKey,
	    							'method':"client.login", 
	    							'call_id':new Date().getTime(), 
	    							'uniq_id':'TOUCH_TEST',//每次必须取登录用户的sessionKey
	    							 user:'18600019342',
	    							 password:MD5('0510104018'),
	    							'v':'1.0',
	    							'format':'json'
	    					}
	    					var tmpA = new Array();
	    					for(var i in defaultParam){
	    						
	    						tmpA.push(i+"="+window.decodeURIComponent(defaultParam[i]).substring(0, 50));
	    					}
	    					
	    					tmpA.sort();//必须进行排序 //要对所有的数据进行升序排列
	    					var secretKey='91110a41072e4d0bac3ac05a547f3ece';

	    					var sig=MD5(tmpA.join("")+this.defaultSecretKey);
	    					
	    					defaultParam.sig=sig;
	    				
	    					tmpA.push("sig="+sig)
	    					var xhr=new XHR2({
	    						url:this.apiServerURL,
	    						method:"post",
	    						data:defaultParam,
	    						success:function(response){
	    							self.session_key=response.session_key;
	    							self.secretKey=response.secret_key;
	    							callBack(response);	    							
	    						},
	    						failure:function(response){
	    							alert("请求失败");
	    						}
	    					});
	    				},
	    				feedGet:function(callBack){
	    					var defaultParam={
	    							'api_key': this.apiKey,
	    							'method':"feed.get", 
	    							'call_id':new Date().getTime(), 
	    							'session_key':this.session_key,//每次必须取登录用户的sessionKey
	    							'v':'1.0',
	    							'format':'json',
	    							type:this.feedType.join(",")
	    					}
	    					var tmpA = new Array();
	    					for(var i in defaultParam){
	    						tmpA.push(i+"="+window.decodeURIComponent(defaultParam[i]).substring(0, 50));
	    					}	    					
	    					tmpA.sort();//必须进行排序 //要对所有的数据进行升序排列
	    					var sig=MD5(tmpA.join("")+this.secretKey);	    				
	    					defaultParam.sig=sig;	    					
	    					tmpA.push("sig="+sig)
	    					var xhr=new XHR2({
	    						url:this.apiServerURL,
	    						method:"post",
	    						data:defaultParam,
	    						success:function(response){
	    							callBack(response);	    							
	    						},
	    						failure:function(response){
	    							alert("请求失败");
	    						}
	    					});
	    				},
	    				radioGetHome:function(callBack){
	    					
	    					var defaultParam={
	    							'api_key': this.apiKey,
	    							'method':"radio.getHome", 
	    							'call_id':new Date().getTime(), 
	    							'session_key':this.session_key,//每次必须取登录用户的sessionKey
	    							'v':'1.0',
	    							'format':'json'
	    					}
	    					var tmpA = new Array();
	    					for(var i in defaultParam){
	    						tmpA.push(i+"="+window.decodeURIComponent(defaultParam[i]).substring(0, 50));
	    					}	    					
	    					tmpA.sort();//必须进行排序 //要对所有的数据进行升序排列
	    					var sig=MD5(tmpA.join("")+this.secretKey);	    				
	    					defaultParam.sig=sig;	    					
	    					tmpA.push("sig="+sig);
	    					var url="http://api.m.renren.com/api/radio/getHome";
	    					var xhr=new XHR2({
	    						url:this.apiServerURL,
	    						method:"post",
	    						data:defaultParam,
	    						success:function(response){
	    							callBack(response);	    							
	    						},
	    						failure:function(response){
	    							alert("请求失败");
	    						}
	    					});
	    					
	    				}
	    		}
	    		return Oauth;
	    	});
	       
	       
	       