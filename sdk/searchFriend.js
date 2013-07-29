xn.use(["loader_test.OAuthInner","loader_test.SQLite","loader_test.IndexedDB","loader_test.XHR2"],function(OAuth,SQLite,IndexedDB,XHR2){
	  var oauth = new OAuth();
	 
	  oauth.checkLogin(function(data){
		  
		  document.querySelector("section.login_message").innerHTML=examples.simple.userMessage(data);
		  
		  oauth.friendsGet(function(data){
			  SQLite.prepareDatabase(function(db){
				  //存储好友信息				  
				  //SQLite.saveFriends(data.friend_list);
				  console.log(data.friend_list);
			  },function(event){
				  console.log("error"+event.message);
			  }); 
			  document.querySelector("section.searchFriend").innerHTML = xnTemplate.sdk.searchFirends(data);
		  });
		  	
		  oauth.feedGet(function(data){
				 
			   SQLite.prepareDatabase(function(db){					  
					  //SQLite.saveFeed(data.feed_list);
				  },function(event){
					  console.log("error"+event.message);
				  }); 
			   console.log(data.feed_list);
			   document.querySelector("section.feed_list").innerHTML=examples.simple.feed(data); 
		  }); 
		  
	  }); 
	  
	  //var url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter&callback=handleResponse";
	  var url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter";
	  var xhr2 =new XHR2({
			url:url,
			method:"get",
			withCredentials:false,
			data:null,
			success:function(response){
				console.log(JSON.stringify(response));
				
			},
			failure:function(response){
				
				alert("error");
			}
		}); 
	  //获取字库
	  /* var xhr=new XHR2({
			url:"http://t.comicsand.com/manifest/pinyin.php",
			method:"post",
			data:null,
			success:function(response){
				//使用这种存储方式，消耗时间 51396 ms
				SQLite.prepareDatabase(function(db){
					  var array = new Array();
					  for(var i in response){
						  array.push({key:i,value:response[i]});
					  }
					  console.log("sqllite startTime======"+new Date().getTime());
					  SQLite.savePinyin(array);
				  },function(event){
					  console.log("error"+event.message);
				  });
				
				  //indexedDB 消耗时间 2237 ms
				  var indexedDB = new IndexedDB("test",function(event){
					  console.log(new Date().getTime()+"============开始时间");
					  indexedDB.save(response);
					 },function(event){
						 alert("error");
					 });
			},
			failure:function(response){
				alert("请求失败");
			}
		});	
	  */
	  
	  
	/*  SQLite.prepareDatabase(function(db){
		  
		  SQLite.searchWord("马",function(data){
			  console.log(data);
		  });
	  },function(event){
		  console.log("error"+event.message);
	  });*/
	  
	  
  });