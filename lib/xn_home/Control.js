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
			this.lastHash = window.location.hash;
			this._addNavClass(this.lastHash);
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
				if(self.lastHash!=null){
					var onUnLoadEle = document.querySelector(self.lastHash);					
					self._unLoadModule(onUnLoadEle);
				}				
				self.lastHash = window.location.hash;
				self._loadModule(showELe);
				self._addNavClass(self.lastHash);
			};
			document.body.addEventListener("touchstart",function(event){
				
			},false);
			
			document.body.addEventListener("touchend",function(event){
				
			},false);
			
			document.body.addEventListener("click",function(event){
				
			},false);
		},
		_unLoadModule:function(containerELe){
			var onUnLoadFn = containerELe.getAttribute("onunload");
			if(onUnLoadFn!=null)
				eval(onUnLoadFn);
		},
		_loadModule:function(containerELe){
			var onLoadFn = containerELe.getAttribute("onload");
			if(onLoadFn!=null)
				eval(onLoadFn);
		},
		_addNavClass:function(hrefSelector){
			/**
			 * 去掉之前的on
			 */
			var bEle = document.querySelector("nav a.on");
			if(bEle!=null)
				bEle.classList.remove("on");
			/**
			 * 添加新的
			 */
			var Ele = document.querySelector("nav a[href='"+hrefSelector+"']");
			Ele.classList.add("on");
		}
	};
	
	return Control;
});
