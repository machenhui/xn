xn.create("loader_test.SQLite",null,function(){
	var sqlLite={
			prepareDatabase:function(ready,error){
				this.db=openDatabase('documents', '', 'Offline document storage', 5*1024*1024*10);
				
					
				    /*db.changeVersion(db.version, '1.0', function (t) {
				      var callBack=function(){
				    	  
				      }
				      t.executeSql('CREATE TABLE docids (id, name)',[],callBack,callBack);
				    }, error);*/
				
				ready(this.db); 
				return this.db;
			},
			saveFeed:function(jsonArray){
				var self=this;
				 var callBack=function(transaction){
					 if(jsonArray.length==0){
							return ;  
						  }
					  var feed=jsonArray.shift();
					  
					  transaction.executeSql("insert into feed (id,source_id,type,time,user_id,user_name,data) values (?,?,?,?,?,?,?)",
							  [feed.id,feed.source_id,feed.type,feed.time,feed.user_id,feed.user_name,JSON.stringify(feed)],function(t){
						  console.log("存储success");
						  
						  
						  self.saveFeed(jsonArray);
					  },function(error){
						  transaction.executeSql('CREATE TABLE Feed (id,source_id,type,time,user_id,user_name,data)',[],function(){
							  self.saveFeed(jsonArray);
						  },function(error){
							  //self.save(jsonArray);
							  console.log("建表异常"+error);
						  });
						  console.log(error);
						  console.log("存储异常"+error);
						 
					  });
					  
				  };
				  var errorBack=function(sqlError){
					  console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  console.log("打开成功")
				  };
				  this.db.transaction(callBack,errorBack,successBack);
			},
			saveFriends:function(jsonArray){
				var self=this;
				 var callBack=function(transaction){
					 if(jsonArray.length==0){
							return ;  
						  }
					  var friend=jsonArray.shift();
					  
					  transaction.executeSql("insert into friends (user_id,user_name,head_url,data) values (?,?,?,?)",
							  [friend.user_id,friend.user_name,friend.head_url,JSON.stringify(friend)],function(t){
						  console.log("存储success");
						  
						  
						  self.saveFriends(jsonArray);
					  },function(error){
						  transaction.executeSql('CREATE TABLE friends (user_id,user_name,head_url,data)',[],function(){
							  self.saveFriends(jsonArray);
						  },function(error){
							  //self.save(jsonArray);
							  console.log("建表异常"+error);
						  });
						  console.log(error);
						  console.log("存储异常"+error);
						 
					  });
					  
				  };
				  var errorBack=function(sqlError){
					  console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  console.log("打开成功")
				  };
				  this.db.transaction(callBack,errorBack,successBack);
			},
			savePinyin:function(jsonArray){
				var self=this;
				 var callBack=function(transaction){
					 if(jsonArray.length==0){
						 console.log("sqllite endTime======"+new Date().getTime());
							return ;  
						  }
					  var pinyin=jsonArray.shift();
					  
					  transaction.executeSql("insert into pinyin (pinyin,words) values (?,?)",
							  [pinyin.key,pinyin.value],function(t){
						  //console.log("存储success");
						  
						  
						  self.savePinyin(jsonArray);
					  },function(t,error){
						  
						  console.log(error);
						  console.log("存储异常"+error);
						 
					  });
					  
				  };
				  var errorBack=function(sqlError){
					  //console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  //console.log("打开成功")
				  };
				  
				  this._checkTableCreate("pinyin",function(){
					  //已创建 ,代表已经有数据，不做处理
					  self.db.transaction(callBack,errorBack,successBack);
				  },function(){
					  //没创建
					  self.db.transaction(function(transaction){
						  console.log("建表");
						  transaction.executeSql('CREATE TABLE pinyin (pinyin,words,PRIMARY KEY (pinyin))',[],function(){
							  self.db.transaction(callBack,errorBack,successBack);
						  },function(error){
						  
						  console.log("建表异常"+error);
						  });
					  },errorBack,successBack);
					 
				  })
				  								
			},
			/**
			 * 按照汉字查拼音
			 * @param word 中文汉字
			 * @param callBack 查询回调方法
			 */
			searchWord:function(word,callBack){
				var self=this;
				 var trans_callBack=function(transaction){  
					  transaction.executeSql("select pinyin from pinyin where words like \"%"+word+"%\"",
							  [],function(t,result){
						  var returnArray = new Array();
						  
						  for(var i = 0;i<result.rows.length;i++){
							 
							  returnArray.push(result.rows.item(i).pinyin);
						  }
						  callBack(returnArray);
					  },function(error){
						  
						  console.log(error);
						  console.log("查询异常"+error);
						 
					  });
					  
				  };
				  var errorBack=function(sqlError){
					  console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  console.log("打开成功")
				  };
				  this.db.transaction(trans_callBack,errorBack,successBack);
			},
			_checkTableCreate:function(tableName,createCallBack,noCreateCallBack){				
				var self=this;
				var callBack=function(transaction){					 
					  transaction.executeSql("select * from sqlite_master where type='table' and name='"+tableName+"'",
							  [],function(t,result){
						    if(result.rows.length == 0){
						    	noCreateCallBack();
						    }else{
						    	createCallBack();
						    }
					  },function(error){						  
						  console.log("检测异常建表"+error);						 
					  });
				  }  
				  var errorBack=function(sqlError){
					  console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  console.log("打开成功")
				  };
				  this.db.transaction(callBack,errorBack,successBack);	
					
			},
			getTable:function(tableName,callBack){
				var self=this;
				 var trans_callBack=function(transaction){  
					  transaction.executeSql("select data from "+tableName,
							  [],function(t,result){
						  var returnArray = new Array();
						  for(var i = 0;i<result.rows.length;i++){
							 
							  returnArray.push(JSON.parse(result.rows.item(i).data));
						  }
						  callBack(returnArray);
					  },function(error){
						  
						  console.log(error);
						  console.log("查询异常"+error);
						 
					  });
					  
				  };
				  var errorBack=function(sqlError){
					  console.log(sqlError+"打开异常");
				  };
				  var successBack=function(){
					  console.log("打开成功")
				  };
				  this.db.transaction(trans_callBack,errorBack,successBack);
			}
	};
	
	
	
	return sqlLite;
	
});