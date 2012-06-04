xn.create("loader_test.Extend",null,function(){
	function extend(baseObject,options){
		var result = baseObject;
		if(baseObject==null){
			result=options;
			return result;
		}
		
		for(var i in options){
			var baseI = result[i];
			var optionsI = options[i];
			switch(typeof(baseI)){
				case "object":
					result[i] = extend(baseI,optionsI);
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
		var result = baseObject;
		for(var i = 1;i<length;i++){
			result = extend(result,arguments[i]);
			
		}		
		return result;
	};
});