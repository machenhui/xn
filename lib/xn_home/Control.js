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
			/*this.lastHash = window.location.hash;
			this._addNavClass(this.lastHash);
			var showELe = document.querySelector(window.location.hash);
			this._loadModule(showELe);*/
			
			this._updateModule();
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
				if(self.isClicked != true){
					self._updateModule();
				}
				self.isClicked = false;
			};
			document.body.addEventListener("touchstart",function(event){
				self.isClicked = false;
			},false);
			
			document.body.addEventListener("touchend",function(event){
				self.isClicked = false;
			},false);
			
			document.body.addEventListener("click",function(event){
				var target = event.target;
				if(target.tagName == "A"&&target.href!=null){
					if(target.target!= null){
						return;
					}
					event.preventDefault();
					event.stopPropagation();
					if(event.stopImmediatePropagation){
						event.stopImmediatePropagation();
					}
					
					self.isClicked = true;
					window.location.href = target.href;
					
					self._updateModule();
				}
			},false);
		},
		_updateModule:function(){
			var self = this;
			var showELe = document.querySelector(window.location.hash);
			if(self.lastHash!=null){
				var onUnLoadEle = document.querySelector(self.lastHash);					
				self._unLoadModule(onUnLoadEle);
				
				/**
				 * 做动画效果
				 */
				
				window.onwebkitanimationend = function(){					
					onUnLoadEle.style.display = "block";					
					showELe.classList.remove("ease-in");
					
					onUnLoadEle.style.display = "none";
					onUnLoadEle.classList.remove("ease-out");
					
				};
				/*document.body.addEventListener("webkitanimationend",function(event){
					alert(6666);
				},false);*/
				onUnLoadEle.classList.add("ease-out");
				showELe.classList.add("ease-in");
			}	
			
			showELe.style.display="block";
			self.lastHash = window.location.hash;
			self._loadModule(showELe);
			self._addNavClass(self.lastHash);
		},
		_unLoadModule:function(containerELe){
			var onUnLoadFn = containerELe.getAttribute("onunload");
			if(onUnLoadFn!=null)
				eval(onUnLoadFn);
		},
		_loadModule:function(containerELe){
			var onLoadFn = containerELe.getAttribute("onload");
			if(onLoadFn!=null){
				eval(onLoadFn);
			}
				
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
