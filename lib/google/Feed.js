/**
 * 使用google Feed的API去加载资源
 * @requires 需要先加载google 的 jsapi
 */
xn.create("google.Feed",null,function(){
	  
	    var followsFn = new Array();
        var isLoad = false;
	    function initialize() {
	    	loadScience();
	    	loadTechnology();
	    	loadChina();
	    	loadCustomerSearch("android");
	    	loadCustomerSearch("tizen");
	    	isLoad = true;
	    	for (var i = 0; i<followsFn.length;i++){
	    		var item =followsFn[i];	    		
	    		if(typeof(item)=="function")
	    		  followsFn[i]();
	    	}
	    }
	    
	    function loadScience(){
	        var feed = new google.feeds.Feed("https://news.google.com/news/feeds?pz=1&cf=all&ned=cn&hl=zh-CN&topic=snc&output=rss");
	        feed.setNumEntries(200);
	        feed.load(function(result) {
	          if (!result.error) {
	            var container = document.querySelector("#science .feed");
	            container.innerHTML = "";
	            for (var i = 0; i < result.feed.entries.length; i++) {
	              var entry = result.feed.entries[i];
	              var div = document.createElement("div");
	              div.innerHTML = entry.content;
	              
	              container.appendChild(div);
	            }
	          }
	        });
	    }
	    
	    function loadTechnology(){
	        var feed = new google.feeds.Feed("http://news.google.com/news/feeds?pz=1&cf=all&ned=cn&hl=zh-CN&topic=tc&output=rss");
	        feed.setNumEntries(20);
	        feed.load(function(result) {
	          if (!result.error) {
	            var container = document.querySelector("#technology .feed");
	            container.innerHTML = "";
	            for (var i = 0; i < result.feed.entries.length; i++) {
	              var entry = result.feed.entries[i];
	              var div = document.createElement("div");
	              div.innerHTML = entry.content;
	              //div.appendChild(document.createTextNode(entry.title));
	              container.appendChild(div);
	            }
	          }
	        });
	    }
	    
	    function loadChina(){
	        var feed = new google.feeds.Feed("http://news.google.com/news/feeds?ned=cn&topic=n&output=rss");
	        feed.setNumEntries(20);
	        feed.load(function(result) {
	          if (!result.error) {
	            var container = document.querySelector("#china .feed");
	            container.innerHTML = "";
	            for (var i = 0; i < result.feed.entries.length; i++) {
	              var entry = result.feed.entries[i];
	              var div = document.createElement("div");
	              div.innerHTML = entry.content;
	              //div.appendChild(document.createTextNode(entry.title));
	              container.appendChild(div);
	            }
	          }
	        });
	    }
	    function loadCustomerSearch(keyWord){
	    	 var feed = new google.feeds.Feed("http://news.google.com/news/feeds?ned=cn&output=rss&q={keyWord}".replace("{keyWord}",keyWord));
		        feed.setNumEntries(20);
		        feed.load(function(result) {
		          if (!result.error) {
		            var container = document.querySelector("#"+keyWord+" .feed");
		            container.innerHTML = "";
		            for (var i = 0; i < result.feed.entries.length; i++) {
		              var entry = result.feed.entries[i];
		              var div = document.createElement("div");
		              div.innerHTML = entry.content;
		              //div.appendChild(document.createTextNode(entry.title));
		              container.appendChild(div);
		            }
		          }
		        });
	    	
	    }
	    
	    function loadWeather(woeid){
	    	
	        var feed = new google.feeds.Feed("http://weather.yahooapis.com/forecastrss?w={woeid}&u=c".replace("{woeid}",woeid));
	        feed.setNumEntries(20);
	        feed.load(function(result) {
	          if (!result.error) {
	            var container = document.querySelector("#weather .feed");
	            container.innerHTML = "";
	            for (var i = 0; i < result.feed.entries.length; i++) {
	              var entry = result.feed.entries[i];
	              var title = document.createElement("div");
	              title.innerHTML = entry.title;
	              container.appendChild(title);
	              
	              var div = document.createElement("div");
	              div.innerHTML = entry.content;
	              container.appendChild(div);
	              
	            }
	          }
	        });
	        	       	        
	    }
	    
	   
	    
	    return {
	    	loadData:function(){
	    		 google.load("feeds", "1",{
	    			 callback:initialize
	    		 });
	    		 
	    	},
	    	loadWeather:function(woeid){
	    		if(isLoad==false){
	    			followsFn.push(function(){
		    			loadWeather(woeid);
		    		});
	    		}else{
	    			loadWeather(woeid);
	    		}
	    		
	    		
	    	}
	    };
});