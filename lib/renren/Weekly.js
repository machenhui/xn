/**
 * 工作周报JS
 */
xn.create("renren.Weekly",["loader_test.XHR2"],function(XHR2){
	var weekly = function(){
		this._init.apply(this,arguments);
	};
	weekly.prototype = {
			_init:function(){
				this._getData();
			},
			_getData:function(){
				var xhr2 = new XHR2({
						url:"http://xn.com/resource/weekly.json",
						success:function(data){
							debugger;
						},
						error:function(){
							debugger;
						}
				});
			}
	};
	
	return weekly;
});