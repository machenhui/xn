
/**
 * @author Administrator
 * @description js文件记载器，负责加载js文件
 */

var Loader=function(){	
	this._init.apply(this,arguments);
};
Loader.prototype={
		/**
		 * @description 基本配置信息
		 */
		_CONFIG:{
				_path:{
					defaultBaseURL:null//baseURL，加载默认的ＪＳ文件
				},//记录的每个Module对应的JS文件地址
				_charset:"utf-8"//默认的编码字符集
		},
		/**
		 * @description Module 的各种状态
		 */
		SCRIPT_STATE:{
				ERROR:-1,//加载异常
				UNLOAD:0,//未加载
				LOADING:1,//加载中状态
				LOADED:2,//以记载完成,未注册，可能能会将JS代码注释掉，以提高效率，Map中存储Script对象
				REGEST:3,//已注册状态，不可用，仅仅是注册而已
				INTERACTIVE:4,//待用状态，没有执行方法体，所有依赖全部加在完成
				COMPLETE:5//已完成状态，所有的依赖已经记载完成，可以使用状态，执行方法体，返回最终对象
		},
		/**
		 * 存储相关信息
		 */
		storageMaps:{
				followMap:{},//粉丝Map
				statusMap:{},//key=moduleName,value={state:"状态",requires:[]/*依赖的module*/,callBack/*回调方法*/}
				useMap:{},//使用Module和注册Module区分处理，key=xnUse+parseInt(Math.random()*100000) value={requires:[],callBack:/*回调方法*/}
				contentMap:{},//key=moduleName,value=content
				scriptMap:{}//记录script文件的加载状态
		},
		/**
		 * @description 初始化Loader组建
		 * @param config 基本的配置信息，覆盖默认的_CONFIG,config==null 时，根据Loader的URL找到BaseURL
		 */
		_init:function(config){
			//重写defaultURL
			this._CONFIG._path.defaultBaseURL=this._getBaseURL("core-beta/Loader");			
			if(config!=null){
				//重写_CONFIG 对象
				this.extendsObject(this._CONFIG,config);				
			}
		},
		/**
		 * @description 继承某个对象
		 * @param object 原始对象，要继承的对象
		 * @param propertys  要扩展原始对象的对象
		 */
		extendsObject:function (object,propertys){
			if(object==null){
				object=propertys;
			}
			//原型链上扩展对象
			for(var i in propertys){
				if((object[i]==null||typeof(object[i])!="object")&&propertys[i]!=null){					
					object[i] = propertys[i];
				}else if(typeof(object[i])=="object"){
					this.extendsObject(object[i],propertys[i]);
				}else{
					console.error(typeof(object[i]));
				}
			}
		},
		/**
		 * @description 自动获取相对的baseURL
		 * @param relativeLoaderPath loader的相对地址
		 * @returns 返回baseURL地址
		 */
		_getBaseURL:function(relativeLoaderPath){
			var scripts=document.scripts;
			var length=scripts.length;
			for(var i=0;i<length;i++){
				var script=scripts[i];
				if(script.src.search(relativeLoaderPath)!=-1){
					return 	script.src.split(relativeLoaderPath)[0];
				}
			}
			return null;
		},
		/**
		 * 为script 绑定事件
		 * @param script
		 */
		_bindScript:function (script,name){
			var that=this;
			script.addEventListener("load",function(event){
				//script 加载完成
				if(that.storageMaps.statusMap[name].state<that.SCRIPT_STATE.LOADED)
					that.storageMaps.statusMap[name].state=that.SCRIPT_STATE.LOADED;
			},false);
			script.addEventListener("error",function(event){
				//script 加载失败 返回初始状态
				that.storageMaps.statusMap[name].state=that.SCRIPT_STATE.ERROR;
			},false);
		},
		/**
		 * @description 根据Module的名称获取相应的URL地址
		 * 				1.从Config中读取
		 * 				2.根据默认路径加载
		 * @param name Module的名称
		 * @returns 返回对应的URL地址
		 */
		_getPath:function(name){
			if(this._CONFIG._path[name]==null){
				return this._CONFIG._path.defaultBaseURL+name.replace(".","/")+".js";
			}else{
				return this._CONFIG._path[name].path;
			}
			
		},
		/**
		 * @description 加载JS文件
		 * @param url JS文件的URL地址
		 */
		_loadScript:function(url,name){
			var script=document.createElement("script");
			script.charset=this._CONFIG._charset;
			this._bindScript(script,name);
			script.type="text/javascript";
			script.src=url;
			document.head.appendChild(script);			
		},
		/**
		 * @param name ModuleName
		 */
		_loadModule:function(name){
						
			//找到所有的requires,记载所有的子文件			
			var requires=null;
			if(this._CONFIG._path[name]!=null){
				requires=this._CONFIG._path[name].requires;
			}
			if(requires!=null&&requires.length>=0){
			   for(var i = 0; i<requires.length;i++){
				   var require=requires[i];
					var requireState=this.storageMaps.statusMap[require];
					
					if(requireState==null){
						requireState=this.storageMaps.statusMap[require]={
								state:this.SCRIPT_STATE.UNLOAD
						};
					}
					
					//依赖未加载，加载这个Module
					if(requireState.state<this.SCRIPT_STATE.LOADING){
						//加入followMap
						if(this.storageMaps.followMap[require]==null){
							this.storageMaps.followMap[require]=new Array();
						}
						//加入到依赖Module的粉丝列表
						this.storageMaps.followMap[require].push(name);
						console.log("并行加载组件===="+require);
						this._loadModule(require);						
					} 				   
			   }				
			}
			
			//先加载所有的依赖，再加载自己
			var state=this.storageMaps.statusMap[name];
			var url=this._getPath(name);
			var scriptState=this.storageMaps.scriptMap[url];
			//获取script 加载文件的状态
			if(scriptState==null||scriptState<this.SCRIPT_STATE.LOADING){
				//未开始加载
				this._loadScript(url,name);
				//设置Module 处于加载中状态
				state.state=this.SCRIPT_STATE.LOADING;
				//设置script 处于加载中  做一下标记，避免重复加载
				this.storageMaps.scriptMap[url]=this.SCRIPT_STATE.LOADING;
			}else if(scriptState==this.SCRIPT_STATE.LOADING){
				state.state=this.SCRIPT_STATE.LOADING;
				
			}else if(scriptState>this.SCRIPT_STATE.LOADED){
				//脚本已经加载完成
				if(state.state<this.SCRIPT_STATE.LOADED){
					//如果小于加载完成状态，设置为加载完成
					state.state=this.SCRIPT_STATE.LOADED
				};
			}
							
		},
		/**
		 * @description 执行一个包，加载依赖，并执行callback
		 * @param requires
		 * @param callback
		 */
		use:function(requires,callBack){
			var name="xnUse"+parseInt(Math.random()*1000000000);
			this.storageMaps.useMap[name]={
					callBack:callBack
			};			
			this.create(name, requires, callBack);
			
			
		},
		/**
		 * @description 注册一个Module
		 * @param name Module name
		 * @param requires 依赖的Module
		 * @param callback  毁掉方法
		 */
		create:function(name,requires,callBack){
			console.log("注册======="+name);
			var self=this;
			if(requires==null||requires.length==0){				
				this._interactive(name, callBack);
			}else{
				var watchList = new Array();
				var toLoadModule = new Array();
				//加载依赖的包
				for(var i = 0;i<requires.length;i++){
					var require = requires[i];
					if(this.storageMaps.followMap[require]==null){
						this.storageMaps.followMap[require]=new Array();
					}
					//加入到依赖Module的粉丝列表
					this.storageMaps.followMap[require].push(name);
					var requireState = this.storageMaps.statusMap[require];
					if(requireState==null){
						requireState=this.storageMaps.statusMap[require]={
								state:this.SCRIPT_STATE.UNLOAD
						};
					}
					
					//依赖未加载，加载这个Module
					if(requireState.state<this.SCRIPT_STATE.LOADING){						
						toLoadModule.push(require);																		
					}
					
					//依赖处于不可用状态，则将依赖加入我的watchList
					if(requireState.state<this.SCRIPT_STATE.INTERACTIVE){
						watchList.push(require);
					}					
				}
				
				
				
				//设置包处于注册状态
				if(this.storageMaps.statusMap[name]==null){
					this.storageMaps.statusMap[name]={
						state:this.SCRIPT_STATE.REGEST,
						watchList:watchList,
						requires:requires,
						callBack:callBack
					}
					console.log("创建state======"+name);
				}else{
					this.extendsObject(this.storageMaps.statusMap[name],{
						state:this.SCRIPT_STATE.REGEST,
						watchList:watchList,
						requires:requires,
						callBack:callBack
					});
					console.log("重写state======"+name);
				}
			 
				//加载需要加载的组件
				for(var i = 0;i < toLoadModule.length;i++){
					console.log("线性加载组件"+toLoadModule[i]);
					self._loadModule(toLoadModule[i]);
				
				}
				
				if(watchList.length == 0){
					//如果没有需要关注的，也就是所有的依赖都已加载完成
					this._interactive(name, callBack);
					
				}
				
			}
		},
		/**
		 * @description 设置一个包处于待用状态
		 * @param name Moudle名称
		 * @param callBack 可执行的方法，返回一个Module 对象
		 */
		_interactive:function(name,callBack){
			//没有依赖，直接处于待用状态
			if(this.storageMaps.statusMap[name]==null){
				this.storageMaps.statusMap[name]={
						state:this.SCRIPT_STATE.INTERACTIVE,
						requires:null,
						callBack:callBack
				};
			}else{
				this.storageMaps.statusMap[name].state=this.SCRIPT_STATE.INTERACTIVE;
				this.storageMaps.statusMap[name].callBack=callBack;
			}					
			//通知Followers 这个Module可用
			var followers=this.storageMaps.followMap[name];	
			console.log(followers+"通知粉丝"+"===="+name);
			if(followers!=null&&followers.length!=0){
				for(var i=0;i<followers.length;i++){
					var follower=followers[i];
					var moduleState=this.storageMaps.statusMap[follower];
					//当粉丝包处于已注册状态时
					if(moduleState!=null&&moduleState.state==this.SCRIPT_STATE.REGEST){
						if(moduleState.watchList.length!=0){
							moduleState.watchList.shift();
						}
						
						if(moduleState.watchList.length==0){
							this._interactive(follower,moduleState.callBack);
						}						
					}
					
				}
			}			
			//如果这个包，在useMap 里面，则执行_complete
			
			if(this.storageMaps.useMap[name]!=null){
				this._complete(name);
			};
			
		},
		/**
		 * @description 执行对应的callBack,并返回对应的content 对象
		 */
		_complete:function(name){
			var moduleState=this.storageMaps.statusMap[name];
		    var requires=moduleState.requires;
		    var params=new Array();
		    if(requires==null&&moduleState.callBack!=null){
		    	params=null;
		    }else if(requires!=null){		    	 
				 for(var i = 0;i<requires.length;i++){
				    	params.push(this._complete(requires[i]));
				 }
		    }
		    var content=this.storageMaps.contentMap[name];
		    if(content==null){
		    	//修改成为一部的执行Function，返回Content对象
		    	this.storageMaps.contentMap[name]=content=moduleState.callBack.apply(window,params);
		    	
		    }
		    return content;
		}		
}

var tmpXn=window.xn;
var useCache=window.xn._cache_use;
var createCache=window.xn._cache_create;
window.xn=new Loader(tmpXn.config);

if(useCache!=null&&useCache.length>0){
	for(var i = 0;i<useCache.length;i++){
		var tmpUse=useCache[i];
		xn.use.apply(window.xn,tmpUse);
	}	
}
if(createCache!=null&&createCache.length>0){
	for(var i = 0;i<createCache.length;i++){
		var tmpCreate=createCache[i];
		xn.create.apply(window.xn,tmpCreate);
	}	
}

