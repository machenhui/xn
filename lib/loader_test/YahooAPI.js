xn.create("loader_test.YahooAPI",["loader_test.Extend","loader_test.XHR2"],function(extend,XHR2){
		var YahooInfo = {
			consumer_key:"dj0yJmk9T3BQRVE0VEQ0enN0JmQ9WVdrOU5GbHpOMlZtTmpRbWNHbzlNVFExTnpVMU9EVTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD01ZA--",
			consumer_secret:"1135677627c7275f7c5ec3a1aae894de477f872e"
		};
		
		var YahooURLs = {
				getWeather:"http://weather.yahooapis.com/forecastrss?w={woeid}&u=c",
				getPlace:"http://where.yahooapis.com/geocode?q={lat},+{lon}&gflags=R&appid={api_key}&flags=J"
		};
	
	   var YahooAPI = function(){
		   this._init.apply(this,arguments);	
		};
		YahooAPI.prototype={
			_init:function(){
				
			},
			getPlace:function(lat,lon,callBack){
				var self = this;
				var xhr2 =new XHR2({
					url:YahooURLs.getPlace.replace("{api_key}",YahooInfo.consumer_key).replace("{lat}",lat).replace("{lon}",lon),
					method:"get",
					withCredentials:false,
					isSetCustomeHeader:false,
					data:null,
					success:function(response){						
						if(callBack){
							callBack(response.ResultSet.Results[0].woeid);
						}else{
							self.getWeather(response.ResultSet.Results[0].woeid);
						}
					},
					failure:function(response){				
						alert("error");
					}
				});
				
			},
			getWeather:function(woeid){
				  var weatherURL = "http://mc1.test.renren.com/mlogin/xn_api_test/weather?w={woeid}&u=c";
				  var xhr2 =new XHR2({
						url:weatherURL.replace("{woeid}",woeid),
						//url:YahooURLs.getWeather.replace("{woeid}",woeid),
						method:"get",
						withCredentials:false,
						isSetCustomeHeader:false,
						data:{
							format:"json"
						},
						format:"xml",
						success:function(response,xhr,options){
							console.log(response);
							var condition = response.querySelectorAll("condition")[0];
							var attributes = condition.attributes;
							
							response.childNodes[0].querySelectorAll("rss *|condition");
							for (var i = attributes.length-1;i>=0;i--){ 
								
								var attribute = attributes[i];
								console.log(attribute.nodeName+"====="+attribute.value);
							}
							var weatherEle = document.querySelector("#weather");
							weatherEle.innerHTML += response.querySelector("rss channel description").textContent;
							weatherEle.innerHTML += response.querySelector("rss channel item description").textContent;
						},
						failure:function(response){				
							alert("error");
						}
					});
				  
			  }
		};
	return YahooAPI;
});