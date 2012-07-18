/**
 * 检测是否登录人人，未登录显示登录框
 */
xn.create("renren.Login",["loader_test.XHR2","loader_test.MD5","loader_test.XNOAuth"],function(XHR2,MD5,XNOAuth){
		
	var Login = function(){
		this._init.apply(this,arguments);
	};
	Login.prototype = {
			_init:function(){
				
			},
			checkLogin:function(callBack){
				var oauth = new XNOAuth(
						"8a1dccace704454c9a469113750fbdac",
						"4532420eebaa46bbaf68eaccc5c2a41c",
						"http://mc1.test.renren.com/mlogin/xn_api_test/renrenOauthCallBack.html");
				if(oauth){
					oauth.showLoginWindow([
					                       /*"phoneclient.toolLog",
					                       "page.getFansList",
					                       "share.getComments",
					                       "message.delete",*/
					                       /*全部权限*/
					                       "user.getInfo",
					                       "feed.read",
					                       "feed.publishFeed",
					                       "game.scoreUpload",
					                       "radio.getHome",
					                       "lbs.getNearPosiByBound",
					                       "page.becomeFan",
					                       "news.getCount"
					                       ],function(access_token){
															callBack(access_token,oauth);
										   });										
				}
				
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