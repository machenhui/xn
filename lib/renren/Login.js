/**
 * 检测是否登录人人，未登录显示登录框
 */
xn.create("renren.Login",["loader_test.XHR2","loader_test.MD5","loader_test.OAuthInner"],function(XHR2,MD5,OAuthInner){
		
	var Login = function(){
		this._init.apply(this,arguments);
	};
	Login.prototype = {
			_init:function(){
				
			},
			checkLogin:function(callBack){
				var oauthInner = new OAuthInner();
				oauthInner.checkLogin(function(data){
					
					if(callBack){
						callBack(data,oauthInner);
					}
				});
			},
			showLoginWindow:function(){
				
			}
	};
	
	return Login;
});