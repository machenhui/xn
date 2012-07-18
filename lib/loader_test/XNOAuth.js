
xn.create("loader_test.XNOAuth",["loader_test.SHA1","loader_test.XHR2","loader_test.MD5","renren.renrenAPIConfig"],function(SHA1,XHR2,MD5,CONFIG){
	var Oauth = function(){
		
		return this._init.apply(this,arguments);
	};
	Oauth.prototype={
			//my key
			apiKey:"8a1dccace704454c9a469113750fbdac",
			//my key
			secretKey:"4532420eebaa46bbaf68eaccc5c2a41c",
			loginSuccessURL:"http://mc1.test.renren.com/mlogin/xn_api_test/renrenOauthCallBack.html",		    
			_init:function(apiKey,secretKey,callBackURL){
				
				this.apiKey = apiKey;
				this.secretKey = secretKey;					
				this.loginSuccessURL = callBackURL;
								
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
				var self = this;
				if(scope == null){
					scope = new Array();
				}
				
				var refresh_token = window.localStorage.getItem("refresh_token");
				var access_token = window.localStorage.getItem("access_token");
				var local_scope = window.localStorage.getItem("scope");
				var self = this;
				//||local_scope!=scope.join(",")
				if(refresh_token ==  null){
					
					function receiveMessage(event)  
					{  			
					  if (event.origin == "http://mc1.test.renren.com"||event.origin == "http://xn.com")

						  xn.use(["loader_test.LoginSuccess"],function(LoginSuccess){	
								
								LoginSuccess.initParam(event.data,self,function(access_token){
									if(successFn){
										self.access_token = access_token;
										successFn(access_token);
									}									
								});									  
							});					 					   
					}
					window.addEventListener("message", receiveMessage, false);  
										
					var openWindow=CONFIG.authorizeURL+"?client_id="+this.apiKey
					+"&response_type=code&redirect_uri="+this.loginSuccessURL+"&scope="+scope.join(",");
					var renrenLoginEle = document.querySelector("#renrenLogin");					
					if(renrenLoginEle!=null){						
						renrenLoginEle.href=openWindow;
						renrenLoginEle.innerHTML = "请先登录人人网";
					}
				}else{					
					/**
					 * 直接使用
					 */
					self.access_token = access_token;
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
				url:CONFIG.refreshTokenURL+"login/auth/token",
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
				
				for(var i in tokenMessage){
					window.localStorage.setItem(i,tokenMessage[i]);
				}
				
				/**
				 * 存储过期日期
				 */
				if(tokenMessage.expires_in != null){
					window.localStorage.setItem("expires_date_time",new Date().getTime()+tokenMessage.expires_in*1000);
				}
				/**
				 * 提前一分钟换取Token
				 * expires_in 已秒为单位
				 */					
				var timeout = tokenMessage.expires_in-60;
				
				if(timeout>12*3600){
					/**
					  * 有待进一步优化处理啊，一般情况下，他的Token 一个月才过期，也就是30天
					  * 发现数字太大的时候，setTimeout 就会出错
					  */
					timeout = 24*3600;
				}
				
				window.setTimeout(function(){
					
					var data={
							grant_type:"refresh_token",
							client_id:self.apiKey,
							refresh_token:tokenMessage.refresh_token,
							client_secret:self.secretKey
						};
					var xhr=new XHR2({
						url:CONFIG.refreshTokenURL+"login/auth/token",
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
					url:CONFIG.apiServerURL,
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
				for (var i in CONFIG.FEED_TYPE){
					typeArray.push(CONFIG.FEED_TYPE[i]);
				}
				
				var data={
						access_token:access_token,						
						method:"feed.get",
						format:"json",
						v:"1.0",
						type:typeArray.join(",")
					};
				
				data.sig=this._getSig(data);
			
				var xhr=new XHR2({
					url:CONFIG.apiServerURL,
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
			profileGetInfo:function(options,access_token){
											
				var data={
						access_token:access_token,						
						method:"profile.getInfo",
						format:"json",
						v:"1.0"
					};
				
				data.sig=this._getSig(data);
			
				var xhr=new XHR2({
					url:CONFIG.apiServerURL,
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
			/**
			 * 通用的方法调用接口
			 * @param methodName 方法名称
			 * @param params 传递的参数
			 * @param success 成功回调
			 * @param error 失败回调
			 */
			commonMethod:function(methodName,params,successFn,errorFn){
				/**
				 * 验证方法是否存在
				 */
				var methodMap = this._hasMethod(methodName);
				if(methodMap==null){
					if(errorFn){
						errorFn({error_message:"方法不存在"});
					}else{
						alert("请求方法不存在");
					}
					
					return ;
				}
				/**
				 * 验证参数是否正确
				 */
				
				var result = this._checkParam(methodMap, params);
				if(result!=true){
					if(errorFn){
						errorFn(result);
					}else{
						alert("参数不正确");
					}
					
					return ;
				}
				
				/**
				 * 发送请求
				 */
				var data={
						access_token:this.access_token,						
						method:methodName,
						format:"json",
						v:"1.0"
					};
				for(var i in params){
					data[i]=params[i];
				}
				data.sig=this._getSig(data);
			
				var xhr=new XHR2({
					url:CONFIG.apiServerURL,
					method:"post",
					data:data,
					success:function(response){
						if(successFn)
							successFn(response);
					},
					failure:function(response){
						if(errorFn)
							errorFn(response);
						else
							console.error("加载异常"+response);
					}
				});
				
				
				
			},
			_hasMethod:function(methodName){
				var mArray = methodName.split(".");
				var APIMap = CONFIG.APIMap;
				
				for (var i = 0;i<mArray.length;i++){
					if(APIMap[mArray[i]]==null)
						return null;
					else
						APIMap = APIMap[mArray[i]];
				}
				
				return APIMap;
			},
			_checkParam:function(methodMap,params){
				var requiredMap = methodMap.required;
				var optionalMap = methodMap.optional;
				
				/**
				 * 检测是否少参数
				 */
				if(requiredMap!=null){
					if(params==null){
						return {
							error_message:"请传递参数:"+params
						};
					}
					for(var i in requiredMap){
						if(params[i]==null){
							
							return {
								error_message:"缺少参数:"+i
							};
						}else{
							/**
							 * 检测是否满足长度要求
							 */
							if(requiredMap[i]!=null&&requiredMap[i].max_length != null){
								if(params[i].length>=requiredMap[i].max_length){
									var error_message = "参数"+i+"过长:"+params[i]+",最大长度为"+requiredMap[i].max_length;
									
									return {
										error_message:error_message
									};
								}
							}
						}
					}
				}
				
				/**
				 * 检测可选参数
				 */
				if(params != null)
				for(var i in params){
					
					if(optionalMap[i]!= null && optionalMap[i].max_length!=null){
						if(params[i].length>=optionalMap[i].max_length){
							var error_message = "参数"+i+"过长:"+params[i]+",最大长度为"+optionalMap[i].max_length;
							
							return {
								error_message:error_message
							};
						}
					}
				}
				
				return true;	
				
			}
			
	};
	
	function xnOauth(apiKey,secretKey,callBackURL){
		if(apiKey==null){
			alert("apiKey 不能为空");
			return null;
		}
		
		if(secretKey==null){
			alert("secretKey 不能为空");
			return null;
		}
		
		if(callBackURL==null){
			alert("callBackURL 不能为空");
			return null;
		}
		
		return new Oauth(apiKey,secretKey,callBackURL);
	}
	return xnOauth;
});