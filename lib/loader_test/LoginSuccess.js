xn.create("loader_test.LoginSuccess",["loader_test.OAuth-test"],function(OAuth){
	var oauth = new OAuth();
	return {
		access_token:"",
		expires_in:"",
		initParam:function(){
			var hash = window.location.search.slice(1);
			var hA=hash.split("&");
			for(var i = 0;i < hA.length;i++){
				var kv = hA[i].split("=");
				this[kv[0]]=kv[1];
			}
			
			oauth.getRefreshTooken(this.code);
		},
		friendsGet:function(callBack){
			oauth.friendsGet({
				success:function(data){
					callBack(data)
				},
				error:function(message){
					alert(message);
				}
			},this.access_token);
			//oauth.sigTest();
		}
	}
})