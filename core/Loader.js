/**
 * @fileOverview xn 包机制支持类
 * @author chenhuima
 * @version 1.0
 */
(function() {
	// TODO: 循环依赖的问题，需要解决

	/**
	 * 删除字符串中的所有空格
	 * 
	 * @param {string}
	 *            string 要删除空格的字符串
	 * @type string
	 * @return 去除空格后的新字符串
	 */
	function trim(string) {
		var reg = /\s/g;
		trim = function(string) {
			return string.replace(reg, '');
		};
		return trim(string);
	}

	/**
	 * 循环数组中的每一项，依次交给迭代器执行
	 * 
	 * @param {Array}
	 *            array 要循环的数组
	 * @param {function}
	 *            iterator 迭代器
	 */
	function each(array, iterator) {
		for (var i = 0, l = array.length; i < l; i++) {
			iterator(array[i]);
		}
	}

	/**
	 * 绑定执行域和方法参数
	 * 
	 * @param {function}
	 *            func 要绑定的方法
	 * @param {Object}
	 *            scope 执行域
	 * @type Function
	 * @return Function
	 */
	function bind(func, scope) {
		var args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function() {
			var thisArgs = args.concat();
			for (var i = 0, il = arguments.length; i < il; i++) {
				thisArgs.push(arguments[i]);
			}
			return func.apply(scope, thisArgs);
		};
	}

	/**
	 * 把字符串去除所有空格，并用逗号分隔成为一个数组
	 */
	function toArray(string) {
		switch (typeof(string)) {
			case 'string' :
				string = (string = trim(string)).split(',');
			case 'object' :
				if (string !== null && string.push) {
					if (string.length == 0)
						return null;
					return string;
				}
			default :
				return null;
		}
	}

	/**
	 * 拷贝对象
	 */
	function clone(object) {
		switch (typeof(object)) {
			case 'object' :
				if (object != null && typeof(object.length) == 'number') {
					return object.concat();
				}
				break;
		}
		return object;
	}

	/**
	 * ******************************************** About DOMContentLoaded
	 * *********************************************
	 */

	var domLoaded, // is Dom Loaded
	domFollowers; // 跟踪domload事件的方法列表

	/**
	 * domload事件之后的回调方法
	 */
	function loadedDom() {
		domLoaded = true;
		// 循环每个事件的跟踪者，执行相应的方法
		if (!domFollowers)
			return;
		for (var i = 0, il = domFollowers.length; i < il; i++) {
			var func = domFollowers[i];
			switch (typeof(func)) {
				case 'function' :
					func();
					break;
				case 'object' :
					if (func.length == 3) {
						// console.log(func[0]+'\n'+func[2]);
						func[0].apply(func[1], func[2]);
					}
					break;
			}
		}
		domFollowers = null;
	}

	/**
	 * 针对ie 判断是否domContent ready
	 */
	function doScrollCheck() {
		if (domLoaded == true) {
			return;
		}

		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch (e) {
			setTimeout(doScrollCheck, 1);
			return;
		}
		loadedDom();
	}

	/**
	 * 指定某个方法跟踪dom load事件，并得到新的方法，以后别的程序使用
	 * 
	 * @param {Function}
	 *            callbackfn 跟踪domload的方法
	 * @return 得到的新方法
	 * @type Function
	 */
	function waitLoaded(callbackfn) {
		// 如果能够获取dom的状态，那就直接以此为标准
		var state = document.readyState;

		if (typeof(state) == 'string' && (state == 'complete')) {
			domLoaded = true;
		} else {
			// 启动对domloaded事件的跟踪，针对不同的浏览器进行不同的处理
			domLoaded = false;
			domFollowers = [];

			if (document.addEventListener) {
				// Mozilla、Opera和webkit已经支持了该事件
				document.addEventListener("DOMContentLoaded", function() {
							document.removeEventListener("DOMContentLoaded",
									arguments.callee, false);
							loadedDom();
						}, false);

				window.addEventListener("load", function() {
							loadedDom();
						}, false);
			} else if (document.attachEvent) {

				// 针对IE的处理
				document.attachEvent("onreadystatechange", function() {

							if (document.readyState === "complete") {
								document.detachEvent("onreadystatechange",
										arguments.callee);
								loadedDom();
							}
						});

				window.attachEvent("onload", loadedDom);

				var toplevel = false;

				try {
					toplevel = window.frameElement == null;
				} catch (e) {
				}

				// 如果是IE并且不是iframe增加scrollCheck的判断
				if (document.documentElement.doScroll && toplevel) {
					doScrollCheck();
				}
			}
		}

		// 替代当前的方法，以便之后更高效的调用
		waitLoaded = _waitLoaded;

		return waitLoaded(callbackfn);
	}

	/**
	 * waitLoaded方法的替代方法
	 */
	function _waitLoaded(callbackfn) {
		var state;
		return domLoaded ? callbackfn : (function() {
			var args = [];
			for (var i = 0, il = arguments.length; i < il; i++) {
				args.push(arguments[i]);
			}
			if (domLoaded) {
				callbackfn.apply(this, args);
			} else {
				domFollowers.push([callbackfn, this, args.concat()]);
			}
		});
	}

	/**
	 * ******************************************** Status Constant
	 * *********************************************
	 */

	var Status = {
		uninitialized : 0, // 未初始化：本包还未加载
		loading : 1, // 加载中：本包加载中
		loaded : 2, // 加载完成：本包加载完成，依赖包在加载中。判断条件：直接依赖包中至少有一个包的状态 < 3
		interactive : 3, // 待用：直接依赖包至少都是待用状态。判断条件：直接依赖包没有一个包的状态 < 3
		complete : 4		// 可用：本包已经完全可用
	};

	/**
	 * ******************************************** Require Class
	 * *********************************************
	 */

	/**
	 * 描述一个依赖执行关系
	 * 
	 * @param {Array}
	 *            packages 依赖包的列表
	 * @param {function}
	 *            callback 所有依赖包可用后的回调
	 */
	var Require = function(packages, callback) {
		this._callback = callback;
		this._count = packages.length; // 还未处于待用状态的依赖包的数量
	}

	/**
	 * 设置又有一个包处于激活状态
	 * 
	 * @return 是否所有的包都处于激活状态
	 * @type Boolean
	 */
	Require.prototype.interactiveOne = function() {
		// 如果处于待用状态的依赖包的数量不超过1个，那就调用回调方法
		if (--this._count < 1) {
			// 调用回调方法
			this._callback();

			// 删除应用
			delete this._callback;
			delete this._count;

			return true;
		}
		return false;
	};

	/**
	 * 设置处于待用状态的依赖包的数量
	 */
	Require.prototype.count = function(number) {
		this._count = number;
	};

	/**
	 * ******************************************** Package Class
	 * *********************************************
	 */

	var Package = {

		_followerMap : {},
		_statusMap : {},
		_contentMap : {},
		_requiresMap : {},
		_pathStatus : null, // 路径的状态信息

		/**
		 * 请求包，然后执行回调
		 * 
		 * @param {Array}
		 *            packages 需要加载的包列表
		 * @param {function}
		 *            callback 执行的回调方法
		 */
		require : function(packages, callback) {
			var require = new Require(packages, callback), unloadPackages = [], count = 0;

			// 循环每个依赖包，如果包还未可用，那就在等待队列中增加当前的require对象
			each(packages, bind((function(require, Status) {
						var name = arguments[2], status = Package._status(name);

						// 如果处于完全可用或可交互状态，那就不做处理
						if (status >= Status.interactive)
							return;
						count++;

						// 在等待队列中增加当前的require对象
						var followers = this._followerMap[name];
						if (!followers) {
							followers = this._followerMap[name] = [];
						}
						followers.push(require);

						// 如果包还未初始化，那就需要初始化
						if (status == Status.uninitialized) {
							unloadPackages.push(name);
						}
					}), this, require, Status));

			// 如果依赖包都至少处于待用状态，那就直接激活可用
			if (count == 0) {
				callback();
			} else {
				require.count(count);
				each(unloadPackages, function(name) {

							Package._load(name);
						});
			}
		},

		/**
		 * 注册一个包
		 * 
		 * @param {string}
		 *            name 包的名称
		 * @param {Array}
		 *            requires 依赖的包名列表，如果没有依赖的包，那可以设置成null
		 * @param {function}
		 *            content 要注册的包的内容
		 */
		register : function(name, requires, content) {
			// 如果已经加载成功，那就不再处理
			var status = this._status(name);
			if (status >= Status.loaded)
				return null;

			// 记录包和依赖的内容
			this._contentMap[name] = content;
			this._requiresMap[name] = clone(requires);

			// 设置成加载完成状态
			this._status(name, Status.loaded);

			// 根据依赖包的有无，进行不同的处理
			if (requires == null) {
				// 如果包没有依赖的话，那就设置成可用状态
				this._interactive(name);
			} else {
				this.require(requires, bind(this._interactive, this, name));
			}
		},

		/**
		 * 执行某个方法
		 * 
		 * @param {Array}
		 *            requires 依赖包列表
		 * @param {function}
		 *            callback 回调方法
		 */
		exe : function(requires, callback) {
			this.require(requires, bind((function() {
								// 拿到所有的包对应的信息
								var params = [];

								each(requires, bind((function(params, name) {
													params.push(this
															._complete(name));
												}), this, params));

								// 执行对应的回调方法
								callback.apply(window, params);
							}), this));
		},

		/**
		 * 保存配置信息
		 * 
		 * @param {Object}
		 *            options 配置参数
		 */
		config : function(options) {
			// TODO: 这里应该是增量累加（相同覆盖）配置，现在先简单化处理
			this._config = options;
		},

		/**
		 * 获取某个包所在的文件路径地址
		 * 
		 * @param {String}
		 *            name 包名
		 * @type String
		 * @return 文件url地址
		 */
		_path : function(name) {
			// 获取路径配置信息
			var config = this._config;
			if (!config) {
				// 不存在路径配置，那就从当前url中获取配置

				// 循环每一个script，如果其src属性中存在/xn/Package.js，那就认为上层路径就是其默认地址
				var els = document.getElementsByTagName('script'), xnFile = '/core/Loader.js', length = xnFile.length;
				for (var i = 0, il = els.length; i < il; i++) {
					var src, index;
					if (typeof(src = els[i].src) == 'string'
							&& (index = src.indexOf(xnFile)) != -1) {
						this.config({
									paths : {
										_default : src.substr(0, index) + '/'
									}
								});
						config = this._config;
						break;
					}
				}
				if (!config)
					return '';
			}

			var packs = name.split('.'), unpathed = packs.concat(); // 未被匹配的命名空间
			if (packs.length == 0)
				return '';

			// 获取文件地址
			var files, file;
			if (files = config.files) { // 判断是否存在设置
				if (typeof(file = files[name]) == 'undefined') { // 判断是否存在该包的设置
					if (file = files[packs.slice(0, -1).join('.')]) { // 获取上层包的设置
						unpathed = unpathed.slice(0, -2);
					}

					// TODO: 这里应该可以做到不仅仅是上层，可以是更上层
				} else {
					unpathed = unpathed.slice(0, -1);
				}
			}

			// 根据获得的文件的不同类型，进行不同的处理，以便于找到真正的文件名称
			switch (typeof(file)) {

				// 如果为数字，代表地址存在了一个数组中
				case 'number' :
					file = files._urls[file];
					break;

				// 如果为字符串，那就是地址
				case 'string' :

					// TODO: 由于后端暂时无法改成上面的数字形式，这是一个临时的处理
					if (file.length < 3) {
						file = files._urls[parseInt(file)];
					}

					break;

				// 没有设置上层包
				default :
					// 那就将包名直接转换为路径地址
					file = packs[packs.length - 1] + '.js';
					unpathed = unpathed.slice(0, -1);
			}

			// 如果地址已经是最终的话，那就返回
			// TODO: 这里的判断不够严谨
			if (file.indexOf('http') == 0) {
				return file;
			}

			// 获取路径地址
			var paths = config.paths, // 路径配置信息
			path, i = 1, il = -unpathed.length;
			// 逐个循环上级包，直到找到针对于大包的路径配置信息
			while ((--i) > il) {
				if (path = paths[(i == 0 ? unpathed.slice(0) : unpathed.slice(
						0, i)).join('.')]) {
					if (i < 0) {
						unpathed = unpathed.slice(unpathed.length + i);
					} else {
						unpathed = [];
					}
					break;
				}
			}
			// 如果没有针对于大包的配置信息，那就获取默认的路径地址
			if (!path) {
				path = paths._default;
			}

			// 返回路径加地址信息
			return path
					+ (unpathed.length > 0 ? (unpathed.join('/') + '/') : '')
					+ file;
		},

		/**
		 * 把某个包设置成待用状态
		 */
		_interactive : function(name) {
			// 设置包的状态
			this._status(name, Status.interactive);

			// 如果该包不存在粉丝的话，那就不做后续处理
			var followers = this._followerMap[name];
			if (typeof(followers) != 'object' || followers == null
					|| followers.length == 0)
				return null;

			// 循环所有粉丝，通知增加一个可交互者
			var waiters = [];
			each(followers, bind((function(waiters, require) {
								// 如果某个require中所有等待包已经激活成功了，那就记录下这个require，因为之后需要从followers删除
								if (!require.interactiveOne()) {
									waiters.push(require);
								}
							}), this, waiters));

			// 如果不存在当前包的等待者，那就清除相应的资源
			if (waiters.length == 0) {
				this._followerMap[name] = null;
			} else {
				this._followerMap[name] = waiters;
			}
		},

		/**
		 * 把某个包设置成可用状态。调用这个方法的前提是，这个包已经至少处于待用状态
		 */
		_complete : function(name) {
			// 如果已经是可用状态的话，那就返回包内容
			var map = this._contentMap, content = map[name];
			if (this._status(name) == Status.complete) {
				return content;
			}

			// 包现在处于待用状态，需要将其变为可用状态

			// 拿到所有依赖包的内容
			var requires = this._requiresMap[name], params = [];
			if (typeof(requires) == 'object' && requires !== null
					&& requires.push && requires.length > 0) {
				each(requires, bind((function(params, name) {
									params.push(this._complete(name));
								}), this, params));
			}

			// 保存包的内容
			content = map[name] = typeof(content) == 'function' ? content
					.apply(window, params) : content;

			// 设置包为可用状态
			this._status(name, Status.complete);

			return content;
		},

		/**
		 * 获取一个包的状态
		 * 
		 * @param {string}
		 *            name 包的名称
		 * @type number
		 * @return 包的当前状态
		 */
		/**
		 * 设置一个包的状态
		 * 
		 * @param {string}
		 *            name 包的名称
		 * @param {number}
		 *            [status] 包的状态
		 */
		_status : function(name, status) {
			if (typeof(status) == 'undefined') {
				status = this._statusMap[name];
				if (typeof(status) != 'number') {
					status = this._statusMap[name] = Status.uninitialized;
				}
				return status;
			} else {
				this._statusMap[name] = status;
			}
		},

		/**
		 * 加载一个包
		 */
		_load : function(name) {
			// 如果还未初始化路径信息的话，先进行该项初始化
			var pathStatus = this._pathStatus;
			if (!pathStatus) {
				this._pathStatus = pathStatus = {};
				var scripts = document.getElementsByTagName('script');
				for (var i = 0, il = scripts.length; i < il; i++) {
					var src = scripts[i].src;
					if (typeof(src) == 'string') {
						pathStatus[src] = Status.loading;
					}
				}
			}

			// 获取包所对应的文件路径及其加载状态
			var path = this._path(name), status = pathStatus[path];

			// 如果还没有该文件的状态记录，那就加载该文件
			if (typeof(status) != 'number') {

				this._pathStatus[path] = Status.loading;
				this._status(name, Status.loading);

				var script = document.createElement('script');
				script.src = path;
				script.type = 'text/javascript';
				/*
				 * @comment 临时将编码默认显示设置为GBK，可以通过配置对象charset修改js字符编码 @modifed
				 * flyhuang@sohu-inc.com
				 */
				script.charset = this._config.charset
						? this._config.charset
						: "GBK";
				script.onerror = function() {
					throw new Error("JS文件加载失败：" + path);
				};

				// setTimeout(function(){
				var head = document.getElementsByTagName('head')[0];
				head.appendChild(script);
				head = script = null;
				// },15);

			}
		}
	};

	// 记录正式xn方法之前的缓存
	var cache = window.xn ? window.xn._cache : null;

	/**
	 * 执行指定的内容（方法或者字符串）。如果还有一些前置包（类），那就先加载指定的包（类）及其所依赖的所有包（类），并且等到指定的包已经完全可用，再执行指定的内容。
	 */
	window.xn = function(a, b, c) {

		var ct = typeof(c);

		if (ct == 'function') {
			// 这是要注册一个包
			Package.register(a, toArray(b), c);
		} else {
			// 这是要执行一段代码

			var bt = typeof(b), length = bt == 'undefined'
					? 1
					: (ct == 'undefined' ? 2 : 3), callback = null, options = null, requires = null;

			// 根据参数的数量，决定各个参数的含义
			switch (length) {
				case 1 :

					if (typeof(a) == 'function') {
						// 表示只有一个参数，而且这个参数就是要执行的方法
						callback = a;
					} else {
						// 表示要进行配置
						Package.config(a);
						return;
					}

					// TODO: 这种情况暂时不予处理，预计不会出现使用情景
					break;
				case 2 :
					// 有两个参数，不过有两种情况，一种是依赖哪个包，执行某段程序，另一种是执行某个方法，还有一些配置参数

					if (bt == 'object') {
						// 这是第二种情况：执行某个方法，还有一些配置参数
						callback = a;
						options = b;

						// TODO: 这种情况暂时不予处理，预计不会出现使用情景
					} else {
						// 这是第一种情况：依赖哪个包，执行某段程序
						requires = a;
						callback = b;
					}
					break;
				case 3 :
					// 有三个参数，包括依赖包、执行代码和参数三部分
					requires = a;
					callback = b;
					options = c;

					break;
			}

			// 根据不同的方法类型，进行不同的处理
			switch (typeof(callback)) {
				case 'string' :
					// 如果执行方法只是一段字符串，需要转成一个方法
					callback = new Function(callback);
				case 'function' :
					// 如果存在作用域，那就需要绑定
					if (!!options && options.scope) {
						callback = bind(callback, options.scope);
						options.scope = null;
					}
					break;
			}

			// 如果是希望在DOMContentLoaded事件之后触发，那就进行相应的处理
			// if (options && options.afterDom) {
			callback = waitLoaded(callback);
			// }

			// 拿到依赖包的数据，并转成符合的类型
			requires = toArray(requires);

			// 根据是否存在依赖信息，进行不同的处理
			if (requires == null) {
				callback();
			} else {
				// 调用包系统，执行相应的处理
				Package.exe(requires, callback);
			}
		}
	};

	// 尹航
	// 修复ie6中断加载请求bug
	if (navigator.userAgent.toLocaleLowerCase().split(" ").join("")
			.indexOf("msie6") != -1) {
		var _xn = xn;
		xn = function() {
			(function(_this, _arguments) {
				setTimeout(function() {
							_xn.apply(_this, _arguments);
						}, 0);
			})(this, arguments);
		};
	}

	xn.Package = Package;

	// 如果xn替身已经收集到了要执行的方法，那就处理之
	if (cache && typeof(cache.length) == 'number' && cache.length > 0) {

		// 找到所有是要进行配置的方法，预先执行
		for (var i = 0, il = cache.length; i < il; i++) {
			var args = cache[i];
			if (args.length == 2 && typeof(args[1]) == 'object') {
				// 从待执行数组中删除当前的方法
				cache.splice(i--, 1);
				il--;

				// 执行该项配置
				xn.apply(args.shift(), args);
			}
		}

		// 如果还有存在于替身中的方法，那就放到下一个队列中执行
		if (cache.length > 0) {
			setTimeout((function() {
						for (i = 0, il = cache.length; i < il; i++) {
							args = cache[i];
							xn.apply(args.shift(), args);
						}
					}), 0);
		}
	}

})();
