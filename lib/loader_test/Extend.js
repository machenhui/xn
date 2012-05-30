xn.create("loader_test.Extend",null,function(){
	function extend(baseObject,options){
		var result = {};
		if(baseObject==null){
			result=options;
			return result;
		}
		for(var i in options){
			var baseI = baseObject[i];
			var optionsI = options[i];
			switch(typeof(baseI)){
				case "object":
					result[i] = extend(baseObject[i],optionsI);
					break;
				default:
					result[i]=optionsI;
					break;
			}
		}
		return result;
	}
	
	return function(){
		var length = arguments.length;
		var baseObject = arguments[0];
		var result = {};
		for(var i = 1;i<length;i++){
			result = extend(baseObject,arguments[i])
		}		
		return result;
	}
});