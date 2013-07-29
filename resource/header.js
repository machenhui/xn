var xn = {};
xn.use = function() {
	var arr = [];
	for ( var i = 0, il = arguments.length; i < il; i++) {
		arr.push(arguments[i]);
	}
	xn._cache_use.push(arr);
};
xn.create = function() {
	var arr = [];
	for ( var i = 0, il = arguments.length; i < il; i++) {
		arr.push(arguments[i]);
	}
	xn._cache_create.push(arr);
};
xn._cache_use = new Array();
xn._cache_create = new Array();
xn.config = {
	_path : {
		"core-beta.Class" : {
			path : 'lib/core-beta/Class.js',
			requires : [ "loader_test.A", "loader_test.B" ]
		},
		"loader_test.A" : {
			path : "lib/loader_test/A.js"
		},
		"loader_test.B" : {
			path : "lib/loader_test/B.js"
		}
	}
};
var script = document.createElement('script');
script.src = '/lib/core-beta/Loader.js';
document.getElementsByTagName('head')[0].appendChild(script);
