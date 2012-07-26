/**
 * 负责将多张图片合并成一个，并返回对应的CSS
 */
xn.create("tool.ImageSprit",[],function(){
	
	var ImageSprit = function(){
		this._init.apply(this,arguments);
	};
	
	ImageSprit.prototype = {	
		_init:function(file){
			
		},
		/**
		 * 
		 * @param imageFiles 多张图片
		 * @returns 返回CSSText 和 合成的图片地址
		 */
		mergeImage:function(imageFiles){
			return cssText&imageSrc;
		}
	};
	return ImageSprit;
});