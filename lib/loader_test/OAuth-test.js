xn.create("loader_test.OAuth-test",["loader_test.SHA1","loader_test.XHR2","loader_test.MD5"],function(SHA1,XHR2,MD5){
	var Oauth = function(){
		
		this._init.apply(this,arguments);
	};
	Oauth.prototype={
			apiKey:"8a1dccace704454c9a469113750fbdac",
			secretKey:"4532420eebaa46bbaf68eaccc5c2a41c",
			authorizeURL:"https://graph.renren.com/oauth/authorize",
			loginSuccessURL:"http://test2.touch.renren.com/html/oauth2.0/LoginSuccess.html",
			//apiServerURL:"http://api.renren.com/restserver.do",
			apiServerURL:"http://test4.touch.renren.com/restserver.do",
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
				
			},
			showLoginWindow:function(scope){
				
				var openWindow=this.authorizeURL+"?client_id="+this.apiKey
						+"&response_type=code&redirect_uri="+this.loginSuccessURL+"&scope="+scope.join(" ");
				window.open(openWindow,"renrenoauth",null);
				
			},
			getRefreshTooken:function(code){
				/*https://graph.renren.com/oauth/token?grant_type=authorization_code&
				     client_id=YOUR_API_KEY&redirect_uri=YOUR_CALLBACK_URL&
				     client_secret=YOUR_SECRET_KEY&code=THE_CODE_FROM_ABOVE*/
				 /*    var sigA = new Array();*/
				
			var data={
					grant_type:"authorization_code",
					client_id:this.apiKey,
					code:code,
					redirect_uri:this.loginSuccessURL,
					client_secret:this.secretKey
				}
			
			/*for(var i in data){
				sigA.push(i+"="+window.decodeURIComponent(data[i]));
			}
			sigA.sort();//必须进行排序 //要对所有的数据进行升序排列
			
			var sig=MD5(sigA.join("")+this.secretKey);
			data.sig=sig;*/
		
			//data=this.sigTest();
			var xhr=new XHR2({
				url:"http://test4.touch.renren.com/oauth/token",
				method:"get",
				data:data,
				success:function(response){
					options.success(response);
				},
				failure:function(response){
					alert("error");
				}
			});    
				     
			},
			ajaxLogin:function(username,password){
				var sigA = new Array();				
				var data={
						grant_type:"password",
						username:"18600019342",
						password:"0510104018",
						client_id:this.apiKey,
						client_secret:this.secretKey
					}
				
				for(var i in data){
					sigA.push(i+"="+window.decodeURIComponent(data[i]));
				}
				sigA.sort();//必须进行排序 //要对所有的数据进行升序排列
				
				var sig=MD5(sigA.join("")+this.secretKey);
				data.sig=sig;
			
				//data=this.sigTest();
				var xhr=new XHR2({
					url:"http://test4.touch.renren.com/oauth/token",
					method:"get",
					data:data,
					success:function(response){
						options.success(response);
					},
					failure:function(response){
						alert("error");
					}
				});
			},
			friendsGet:function(options,access_token){
				var sigA = new Array();				
				var data={
						access_token:access_token,						
						method:"friends.getFriends",
						format:"json",
						v:"1.0"
					}
				
				for(var i in data){
					sigA.push(i+"="+window.decodeURIComponent(data[i]));
				}
				sigA.sort();//必须进行排序 //要对所有的数据进行升序排列
				
				var sig=MD5(sigA.join("")+this.secretKey);
				data.sig=sig;
			
				//data=this.sigTest();
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
			sigTest:function(){
				/*http://api.renren.com/restserver.do?
					method=users.getLoggedInUser&
					v=1.0%20&
					api_key=ec9e57913c5b42b282ab7b743559e1b0&
					call_id=1232095295656%20&
					session_key=L6Xe8dXVGISZ17LJy7GzZaeYGpeGfeNdqEPLNUtCJfxPCxCRLWT83x+s/Ur94PqP-700001044%20&
					sig=7149546c014fd6666dd1fa1db373e13c*/
				var sigA=new Array();
				var result="7149546c014fd6666dd1fa1db373e13c";
				var data={
						api_key:"ec9e57913c5b42b282ab7b743559e1b0",
						call_id:"1232095295656",
						method:"users.getLoggedInUser",
						session_key:"L6Xe8dXVGISZ17LJy7GzZaeYGpeGfeNdqEPLNUtCJfxPCxCRLWT83x+s/Ur94PqP-700001044",
						format:"json",
						v:"1.0"
				}
				for(var i in data){
					sigA.push(i+"="+window.decodeURIComponent(data[i]));//必须进行一次解码
				}
				sigA.sort();//必须进行首字母排序
				var testSecretKey="7fbf9791036749cb82e74efd62e9eb38";
				var testStr="api_key=ec9e57913c5b42b282ab7b743559e1b0call_id=1232095295656method=users.getLoggedInUser"
					+"session_key=L6Xe8dXVGISZ17LJy7GzZaeYGpeGfeNdqEPLNUtCJfxPCxCRLWT83x+s/Ur94PqP-700001044"
					+"v=1.07fbf9791036749cb82e74efd62e9eb38";
				
				console.log(sigA.join("")+testSecretKey);
				console.log(testStr);
				console.log(MD5(testStr));
				//var sig=SHA1.hex_sha1(sigA.join("")+testSecretKey);
				var sig=MD5(sigA.join("")+testSecretKey);
				console.log(sig);
				console.log(result);
				data.sig=sig;
				return data;
				//alert(sig==result);
			}
			
	}
	return Oauth;
});