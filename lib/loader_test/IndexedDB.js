xn.create("loader_test.IndexedDB",null,function(){
	var indexedDB = function(){
		this._init.apply(this,arguments);
	}
	indexedDB.prototype={
			_indexedDB:null,
			_init:function(dbName,success,error){
				this.options={
						successFn:success,
						errorFn:error
				};
				this._indexedDB=window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
				
				//打开DB对象
				this.request=this._indexedDB.open(dbName);
				this._bind();
				
			},
			_bind:function(){
				var self = this;
				this.request.addEventListener("success",function(event){
					self._success(event);
				},false);
				this.request.addEventListener("error",function(event){
					self._error(event);
				},false);
			},
			_success:function(event){
				this.db=event.currentTarget.result;
				
				if(this.options.successFn){
					this.options.successFn(event);
				}
			},
			_error:function(event){
				
				if(this.options.errorFn){
					this.options.errorFn(event);
				}
			},
			save:function(jsonData){
				 var db = this.db; 
				 var self=this;
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
					      
					    }else{
					    	db.deleteObjectStore('customers');
					    	console.log("delete table");
					    	
					    	 request.onsuccess(event);
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
						// 保存数据
						var objectStore = transaction.objectStore('customers');
						for (i in jsonData) {
							
						    objectStore.add({ssn:i,data:jsonData[i]});  
						  }
						console.log(new Date().getTime()+"============结束时间");
						// 获取数据
						db.transaction("customers").objectStore("customers").get("an").onsuccess = function(event) {  
							  alert("Name for SSN an is " + event.target.result.data);  
						};												
							
						var customers = [];  
						
						objectStore.openCursor().onsuccess = function(event) {  
							  var cursor = event.target.result;  
							  if (cursor) {  
							    customers.push(cursor.value);  
							    cursor.continue();  
							  } else {  
							    alert("Got all customers: " + customers);  
							  }  
						 };
							
							
							
			     };
			},
			get:function(key){}
	}
	
	return indexedDB;
});