xn.create("loader_test.LoginSuccess",["loader_test.OAuth-test"],function(OAuth){
	var oauth = new OAuth();
	return {
		initParam:function(data,callBack){
						
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
	}
})