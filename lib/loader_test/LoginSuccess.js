xn.create("loader_test.LoginSuccess",[],function(){
	return {
		initParam:function(data,oauth,callBack){
						
			oauth.getRefreshTooken(data.code,function(response){
								
				if(response.refresh_token!= null){
					/**
					 * 启动轮训，获取accessToken
					 */
					oauth.autoUpdateAccessToken(response);
				}
				if(callBack){					
					callBack(response.access_token);
				}
			});
		}
	};
});