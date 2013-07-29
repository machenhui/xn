xn.use(["loader_test.OAuthInner","loader_test.SQLite"],function(OAuth,SQLite){
	  var oauth = new OAuth();
	 
	  if(typeof(Worker) != "undefined"){
		  var worker = new Worker("/static/scripts/loader_test/worker.js");
		  worker.onmessage=function(event){
			  console.log(event.data);
			   /*document.write(event.data); */
		  };
		  worker.postMessage();
	  }
	  
	  
	 
	  oauth.checkLogin(function(data){
		  
		  document.querySelector("section.login_message").innerHTML=examples.simple.userMessage(data);
		 
		  oauth.friendsGet(function(data){
			  SQLite.prepareDatabase(function(db){
				  /*存储好友信息*/
				  
				  SQLite.saveFriends(data.friend_list);
				  console.log(data.friend_list);
			  },function(event){
				  console.log("error"+event.message);
			  }); 
			  document.querySelector("section.friends_message").innerHTML=examples.simple.firends(data);
		  });
		  
		 /* oauth.radioGetHome(function(data){
			  
			  console.log(data);
		  });*/
		   oauth.feedGet(function(data){
			 
			   SQLite.prepareDatabase(function(db){					  
					  SQLite.saveFeed(data.feed_list);
				  },function(event){
					  console.log("error"+event.message);
				  }); 
			   document.querySelector("section.feed_list").innerHTML=examples.simple.feed(data); 
		  }); 
	  }); 
	  
	  if("webkitOverflowScrolling" in document.body.style){
		  console.log("支持滚动条");
	  }else{
		  console.log("不支持滚动条");
	  }
	/*  var testData='{"feed_list":[{"id":16489367981,"source_id":3393159087,"type":502,"time":1334553724223,"user_id":269014407,"user_name":"张帝","head_url":"http://hdn.xnimg.cn/photos/hdn521/20091228/2320/h_tiny_BCkR_5e3b0000b8b22f76.jpg","prefix":"","title":"转自衣立鹏: (大笑)转自李奕亭: 。。。转自侯路 roddick: 转自陈翌旸:","comment_count":0,"status_forward":{"id":3386260134,"status":"忽然想起高中经常出现的一个尴尬状况——拿到一道题，先不管三七二十一，无比风骚地写上一个“解：”，觉得这个字写得真好；读完题后，无比懊恼地叉掉那个风骚的“解：”，重新写上“证明：”……","owner_id":601307873,"owner_name":"我能说脏话吗"},"vip_level":0},{"id":16489243267,"source_id":3393134196,"type":502,"time":1334553334683,"user_id":246355456,"user_name":"王峰","head_url":"http://hdn611.xnimg.cn/photos/hdn611/20090714/1630/tiny_NJWW_1774d017017.jpg","prefix":"","title":"http://tech.qq.com/a/20120416/000096.htm?pgv_ref=aio2012&ptlang=2052 ","comment_count":1,"comment_list":[{"id":11157575726,"user_id":246355456,"user_name":"王峰","head_url":"http://hdn611.xnimg.cn/photos/hdn611/20090714/1630/tiny_NJWW_1774d017017.jpg","time":1334553360000,"content":"短网址呢？"}],"vip_level":0},{"id":16488717078,"source_id":12624736975,"type":104,"time":1334551857435,"user_id":264356783,"user_name":"胡强/Alex.o0/","head_url":"http://hdn.xnimg.cn/photos/hdn221/20120408/2100/tiny_T1S9_140982c019118.jpg","prefix":"分享相册","title":"快速上传","attachement_list":[{"url":"http://fmn.rrimg.com/fmn059/20120110/2340/p_head_4w6v_77f400000d5f125f.jpg","type":"photo"}],"comment_count":0,"share":{"source_id":436399711,"owner_id":277423969,"owner_name":"温 栋","forward_comment":"分享相册"},"vip_level":0},{"id":16485666933,"source_id":3392420527,"type":502,"time":1334543084651,"user_id":234958301,"user_name":"范文娟","head_url":"http://hdn.xnimg.cn/photos/hdn421/20120302/1840/tiny_3FEG_9927n019117.jpg","prefix":"","title":"柳絮满天飞的季节，扼，算不上过敏，嗓子始终不舒服(th)","comment_count":1,"comment_list":[{"id":11156841814,"user_id":228165330,"user_name":"董海伟","head_url":"http://hd20.xiaonei.com/photos/hd20/20070703/22/48/tiny_9449h77.jpg","time":1334549820000,"content":"(口罩)(口罩)(口罩)"}],"origin_type":1,"origin_title":"来自人人触屏","origin_page_id":600002250,"origin_url":"http://page.renren.com/600002250","vip_level":3},{"id":16485350324,"source_id":3392358802,"type":502,"time":1334542265968,"user_id":257115362,"user_name":"闫制动","head_url":"http://hdn.xnimg.cn/photos/hdn321/20120215/1655/tiny_kf1g_451785k019118.jpg","prefix":"","title":"有才！转自项汉忠","comment_count":1,"comment_list":[{"id":11156391852,"user_id":240232425,"user_name":"赵振华","head_url":"http://hdn.xnimg.cn/photos/hdn421/20110705/2215/tiny_Fxcy_41616e019117.jpg","time":1334547240000,"content":"老笑话也有创新啊！！！"}],"status_forward":{"id":3391281226,"status":"公司加班到半夜，所有人都眼皮打架，一姑娘哀叹：“我现在真想变成一个“因”字”，众问其故，姑娘说，就是一个人四肢平摊躺在大床上。 话音刚落，旁边一男同事嘟囔：“困。”办公室里的空气瞬间凝固了.........","owner_id":392108279,"owner_name":"项汉忠"},"vip_level":0},{"id":16485201168,"source_id":3392328159,"type":502,"time":1334541856756,"user_id":254987424,"user_name":"段永超","head_url":"http://hdn.xnimg.cn/photos/hdn221/20100925/1250/h_tiny_ZN5j_6206000024002f75.jpg","prefix":"","title":"转自手机发烧友","comment_count":0,"status_forward":{"id":3392242937,"status":"【iPhone 4S替换送修iPhone 4】由于iPhone 4 16GB停产，目前如果在苹果零售店送修16GB iPhone 4，将免费升级至iPhone 4S。不过更换回来的iPhone 4S是官方翻新版，目前活动仅限美国和加拿大。","owner_id":601052582,"owner_name":"手机发烧友"},"vip_level":0},{"id":16484932029,"source_id":3392263382,"type":502,"time":1334540920856,"user_id":254987424,"user_name":"段永超","head_url":"http://hdn.xnimg.cn/photos/hdn221/20100925/1250/h_tiny_ZN5j_6206000024002f75.jpg","prefix":"","title":"产品经理的逻辑性 ,腾讯大讲堂 http://rrurl.cn/0ldwky","comment_count":0,"vip_level":0},{"id":16484923148,"source_id":12622482764,"type":107,"time":1334540886867,"user_id":254987424,"user_name":"段永超","head_url":"http://hdn.xnimg.cn/photos/hdn221/20100925/1250/h_tiny_ZN5j_6206000024002f75.jpg","prefix":"分享链接","title":"敏捷企鹅的创新功夫 | 互联网的那点事","description":"互联网的那点事 – 聚焦互联网前沿资讯，网络精华内容，交流产品心得！ 热点推荐             敏捷企鹅的创新功夫  2012-04-15 21:35   浏览: 91 vi...","attachement_list":[{"url":"http://alibuybuy-img11.stor.sinaapp.com/2012/04/71e7_1104303n5wcu5unzgci9wf.jpg","type":"photo","main_url":"","large_url":""}],"comment_count":0,"share":{"url":"http://www.alibuybuy.com/posts/72376.html#jtss-renren","forward_comment":"分享链接"},"vip_level":0},{"id":16484795352,"source_id":12622397597,"type":107,"time":1334540394729,"user_id":254987424,"user_name":"段永超","head_url":"http://hdn.xnimg.cn/photos/hdn221/20100925/1250/h_tiny_ZN5j_6206000024002f75.jpg","prefix":"分享链接","title":"Facebook再收购忠诚度服务商TagTile | 互联网的那点事","description":"互联网的那点事 – 聚焦互联网前沿资讯，网络精华内容，交流产品心得！ 热点推荐             Facebook再收购忠诚度服务商TagTile  2012-04-15 22...","attachement_list":[{"url":"http://alibuybuy-img11.stor.sinaapp.com/2012/04/abf7_Tagtile.jpeg","type":"photo","main_url":"","large_url":""}],"comment_count":1,"comment_list":[{"id":1909275499,"user_id":254987424,"user_name":"段永超","head_url":"http://hdn.xnimg.cn/photos/hdn221/20100925/1250/h_tiny_ZN5j_6206000024002f75.jpg","time":1334540340000,"content":"O2O"}],"share":{"comment":"O2O","url":"http://www.alibuybuy.com/posts/72387.html#jtss-renren","forward_comment":"O2O"},"vip_level":0},{"id":16475991034,"source_id":3390309334,"type":502,"time":1334495755588,"user_id":442722221,"user_name":"信念","head_url":"http://head.xiaonei.com/photos/0/0/men_tiny.gif","prefix":"","title":"http://rrurl.cn/0Ng0eT","comment_count":0,"vip_level":0}],"has_more":1,"is_mini_feed":0}';
	  testData = JSON.parse(testData);
	  SQLite.prepareDatabase(function(db){
		  
		  SQLite.saveFeed(testData.feed_list);
	  },function(event){
		  console.log("error"+event.message);
	  });  
	  
	  SQLite.prepareDatabase(function(db){
		  console.log(db);
		  SQLite.getTable("feed",function(dataArray){
			  
			  document.querySelector("#friends_message").innerHTML=examples.simple.feed({feed_list:dataArray});
		  });
	  },function(event){
		  console.log("error"+event.message);
	  });
	*/
	
	/*  const customerData = [  
	                        { ssn: "444-44-4444"+new Date().getTime(), name: "Bill", age: 35, email: "bill@company.com" },  
	                        { ssn: "555-55-5555"+new Date().getTime(), name: "Donna", age: 32, email: "donna@home.org" }  
	                      ]; 
	 var indexedDB = new IndexedDB("test",function(event){
		 var db = event.currentTarget.result; 
		 var request = db.setVersion('1.0');
		 var IDBTransaction = window.webkitIDBTransaction||window.mozIDBTransaction;
		 request.onsuccess = function(event){
			    console.log("Success version.");
			    
			    if(!db.objectStoreNames.contains('customers')){
			      console.log("Creating objectStore");
			      var createRequest = db.createObjectStore('customers', {keyPath: 'ssn'});
			      createRequest.onsuccess=function(event){
			    	  request.onsuccess(event);
			      };
			      createRequest.onerror = function(event){
			    	  alert("error");
			      }
			      return ;
			    }
			    
			    var transaction = db.transaction(['customers'],IDBTransaction.READ_WRITE);
			    
			    transaction.oncomplete = function(){
			      console.log("Success transaction");
			      
			    };
			    transaction.onerror = function(event){
			    	  console.error(event);
				      console.log("error transaction");
				      
				};
				
				var objectStore = transaction.objectStore('customers');
				for (i in customerData) {  
				    objectStore.add(customerData[i]);  
				  } 
				
				*//**获取数据**//*
				db.transaction("customers").objectStore("customers").get("444-44-4444").onsuccess = function(event) {  
					  alert("Name for SSN 444-44-4444 is " + event.target.result.name);  
					};
				*//**使用指针**//*
				
					var customers = [];  
					  
					objectStore.openCursor().onsuccess = function(event) {  
					  var cursor = event.target.result;  
					  if (cursor) {  
					    customers.push(cursor.value);  
					    cursor.continue();  
					  }  
					  else {  
					    alert("Got all customers: " + customers);  
					  }  
					};
					
					
					
	     };
		 
		
	 },function(event){
		 alert("error");
	 });*/
	  
	  
  });