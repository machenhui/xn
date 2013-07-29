/**
 * 工作周报JS
 */
xn.create("renren.Weekly",["loader_test.XHR2"],function(XHR2){
	var weekly = function(){
		this._init.apply(this,arguments);
	};
	weekly.prototype = {
			_init:function(containerEle){
				if(typeof(containerEle) == "string")
					containerEle = document.querySelector(containerEle);
				this.containerEle = containerEle;
				
				this._getData();
			},
			_getData:function(){
				var self = this;
				var xhr2 = new XHR2({
						url:"http://xn.com/resource/weekly.json",
						method:"get",
						withCredentials:false,
						isSetCustomeHeader:false,
						success:function(data){
							var innerHTML =renren.weekly.list({list:data});
							if(self.containerEle)
								self.containerEle.innerHTML = innerHTML;
						},
						error:function(e){
							console.error("获取数据异常");
						}
				});
			},
			showInfo:function(){
				
			},
			hideInfo:function(){
				
			}
	};
	
	return weekly;
});