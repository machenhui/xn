
xn.create("loader_test.OAuth-test",["loader_test.SHA1","loader_test.XHR2","loader_test.MD5"],function(SHA1,XHR2,MD5){
	var Oauth = function(){
		
		this._init.apply(this,arguments);
	};
	Oauth.prototype={
			apiKey:"beeab04e50ba482ea2c2cfbecf8feabd",
			secretKey:"802039801ed846ddb728466fc014e0d7",
			authorizeURL:"https://login.renren.com/mlogin/auth/auth",
			loginSuccessURL:"http://mc1.test.renren.com/mlogin/xn_api_test/renrenOauthCallBack.html",
			baseURL:"http://mc1.test.renren.com/mlogin/xn_api_test/",
			/*apiServerURL:"http://mc1.test.renren.com/mlogin/xn_api_test/api",*/
			apiServerURL:"http://mc2.test.renren.com/api",

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
		    FEED_TYPE:{
		    	SHARE_BLOG:102,
		    	SHARE_PHOTO:103,
		    	SHARE_ALBUM:104,
		    	SHARE_LINK:107,
		    	SHARE_VIDEO:110,
		    	HEAD_UPDATE:501,
		    	STATUS_UPDATE:502,
		    	BLOG_PUBLISH:601,
		    	PHOTO_PUBLISH_ONE:701,
		    	PHOTO_TAG_PUBLISH:702,
		    	PHOTO_PUBLISH_MORE:709,
		    	GIFT_GIVE:801,
		    	LBS_SIGNIN:1101,
		    	LBS_EVALUATION:1104,
		    	PAGE_JOIN:2002,
		    	SHARE_PAGE_BLOG:2003,
		    	SHARE_PAGE_PHOTO:2004,
		    	PAGE_SHARE_LINK:2005,
		    	PAGE_SHARE_VIDEO:2006,
		    	PAGE_STATUS_UPDATE:2008,
		    	SHARE_PAGE_ALBUM:2009,
		    	PAGE_BLOG_PUBLISH:2012,
		    	PAGE_PHOTO_PUBLISH:2013,
		    	PAGE_HEADPHOTO_UPDATE:2015,
		    	MINI_SITE_SHARE_BLOG:3801,
		    	MINI_SITE_SHARE_VIDEO:3802,
		    	MINI_SITE_SHARE_PHOTO:3803,
		    	MINI_SITE_SHARE_LINK:3804,
		    	EDM_TEXT:8001,
		    	EDM_PHOTO:8002,
		    	EDM_VIDEO:8003,
		    	EDM_FLASH:8004,
		    	CHEWEN_PUBLISH_PHOTO:8905,
		    	CHEWEN_PUBLISH_NEWS:8906
		    },
			_init:function(){
				
			},
			/**
			 * 获取sig 的签证
			 * @param data
			 * @return sig
			 */
			_getSig:function(data){
				var sigA = new Array();	
				for(var i in data){
					sigA.push(i+"="+window.decodeURIComponent(data[i]).substring(0, 50));
				}
				sigA.sort();//必须进行排序 //要对所有的数据进行升序排列
				
				return MD5(sigA.join("")+this.secretKey);
			},			
			showLoginWindow:function(scope,successFn){
				if(scope == null){
					scope = new Array();
				}
				var refresh_token = window.localStorage.getItem("refresh_token");
				var access_token = window.localStorage.getItem("access_token");
				var local_scope = window.localStorage.getItem("scope");
				
				if(refresh_token ==  null||local_scope!=scope.join(",").toLowerCase()){
					
					function receiveMessage(event)  
					{  			
					  if (event.origin == "http://mc1.test.renren.com"||event.origin == "http://xn.com")

						  xn.use(["loader_test.LoginSuccess"],function(LoginSuccess){	
								
								LoginSuccess.initParam(event.data,function(access_token){
									
									if(successFn){
										successFn(access_token);
									}									
								});									  
							});					 					   
					}
					window.addEventListener("message", receiveMessage, false);  
										
					var openWindow=this.authorizeURL+"?client_id="+this.apiKey
					+"&response_type=code&redirect_uri="+this.loginSuccessURL+"&scope="+scope.join(",");
					window.open(openWindow,"renrenoauth",null);
				}else{
					
					/**
					 * 直接使用
					 */
					successFn(access_token);
				}
				
				
				
			},
			getRefreshTooken:function(code,suceessFn){
				
			var data={
					grant_type:"authorization_code",
					client_id:this.apiKey,
					code:code,
					client_secret:this.secretKey
				};
			var xhr=new XHR2({
				url:this.baseURL+"login/auth/token",
				method:"get",
				data:data,
				success:function(response){
					if(suceessFn)
						suceessFn(response);
					else{
						console.log(response);
					}
				},
				failure:function(response){
					alert("error");
				}
			});    
				     
			},
			autoUpdateAccessToken:function(tokenMessage){
				var self = this;
				self.tokenMessage = tokenMessage;
				
				for(var i in tokenMessage)
					window.localStorage.setItem(i,tokenMessage[i]);
				
				var timeout = tokenMessage.expires_in-10;
				if(timeout>12*3600){
					/**
					 * 有待进一步优化处理啊，一般情况下，他的Token 一个月才过期，也就是30天
					 */
					timeout = 12*3600;
				}
				
				window.setTimeout(function(){
					
					var data={
							grant_type:"refresh_token",
							client_id:self.apiKey,
							refresh_token:tokenMessage.refresh_token,
							client_secret:self.secretKey
						};
					var xhr=new XHR2({
						url:self.baseURL+"login/auth/token",
						method:"get",
						data:data,
						success:function(response){
							if(response.access_token != null)
								self.autoUpdateAccessToken(response);
							else
								console.error(JSON.stringify(response));	
						},
						failure:function(response){
							alert("error");
						}
					}); 
							
				},timeout*1000);
			  console.log((tokenMessage.expires_in-10)*1000);
			},
			friendsGet:function(options,access_token){
							
				var data={
						access_token:access_token,						
						method:"friends.getFriends",
						format:"json",
						v:"1.0"
					};
							
				data.sig = this._getSig(data);
				var xhr=new XHR2({
					url:this.apiServerURL,
					method:"post",
					data:data,
					success:function(response){
						options.success(response);
					},
					failure:function(response){
						alert("error");
					}
				});
			},			
			feedGet:function(options,access_token){
			
				var typeArray = new Array();
				for (var i in this.FEED_TYPE){
					typeArray.push(this.FEED_TYPE[i]);
				}
				
				var data={
						access_token:access_token,						
						method:"feed.get",
						format:"json",
						v:"1.0",
						type:typeArray.slice(0,10).join(",")
					};
				
				
				data.sig=this._getSig(data);
			
				var xhr=new XHR2({
					url:this.apiServerURL,
					method:"post",
					data:data,
					success:function(response){
						options.success(response);
					},
					failure:function(response){
						alert("error");
					}
				});
			},
			userGetInfo:function(options,access_token){
											
				var data={
						access_token:access_token,						
						method:"user.getInfo",
						format:"json",
						v:"1.0"
					};
				
				data.sig=this._getSig(data);
			
				var xhr=new XHR2({
					url:this.apiServerURL,
					method:"post",
					data:data,
					success:function(response){
						options.success(response);
					},
					failure:function(response){
						alert("error");
					}
				});
			}
			
	};
	return Oauth;
});