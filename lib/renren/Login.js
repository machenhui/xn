/**
 * 检测是否登录人人，未登录显示登录框
 */
xn.create("renren.Login",["loader_test.XHR2","loader_test.MD5","loader_test.OAuth-test"],function(XHR2,MD5,OAuth){
		
	var Login = function(){
		this._init.apply(this,arguments);
	};
	Login.prototype = {
			_init:function(){
				
			},
			checkLogin:function(callBack){
				var oauth = new OAuth();
				oauth.showLoginWindow(["feed.read",
				                       "feed.publishFeed",
				                       "news.readNewsById",
				                       "news.getCount",
				                       "news.getCount",
				                       "news.readNewsById",
				                       "page.becomeFan",
				                       "lbs.getNearPoisByBound"],function(access_token){
					callBack(access_token,oauth);
				});
				/*oauthInner.checkLogin(function(data){
					
					if(callBack){
						callBack(data,oauthInner);
					}
				});*/
			},
			showLoginWindow:function(){
				
			}
	};
	
	return Login;
});