/**
 * 控制页面的画面切换
 * 主要通过对hash 和 a 标签 data-action 的控制实现
 */
xn.create("xn_home.Control",null,function(){
	
	var Control = function (){
		this._init.apply(this,arguments);
	};
	
	Control.prototype = {
		_init:function(){
			this._bind();
		},
		_bind:function(){
			var self = this;
			/**
			 * 不太清楚 为什么不能使用 addEventListener 的方式添加
			 */
			window.onhashchange=function(event){
				/*alert(event.oldURL);
				alert(event.newURL);
				alert(window.location.hash);*/
				var showELe = document.querySelector(window.location.hash);
				
				self._loadModule(showELe);
			};
			document.body.addEventListener("touchstart",function(event){
				
			},false);
			
			document.body.addEventListener("touchend",function(event){
				
			},false);
			
			document.body.addEventListener("click",function(event){
				
			},false);
		},
		_loadModule:function(containerELe){
			var onLoadFn = containerELe.getAttribute("onload");
		}
	};
	
	return Control;
});
