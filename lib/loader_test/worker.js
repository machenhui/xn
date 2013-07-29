/**
 * @author chenhui.ma
 * @description webWorker 测试
 */
self.addEventListener("message",function(event){
	
/*	var data=self.transToURLMap(event.data.files);
	event.currentTarget.postMessage(data);*/
	var result = new Array();
	for(var i in self){
		result.push(i);
	}
	event.currentTarget.postMessage(result);
},false);



/**
 * 将一个files map对象，转换成URLMap对象
 * @param files
 * @returns URLMap对象
 */
function transToURLMap(files){
	var URLMap = {};
	for(var key in files){
		var value = files[key];
		if(typeof(value) == "string"){
			if(URLMap[value] == null){
				URLMap[value] = [key];
			}else{
				URLMap[value].push(key);
			}
		}
	}
	
	return URLMap;
}
