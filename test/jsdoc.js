/** 
 * @namespace XN
 * 
 * @description 测试JSDOC 生成
 * @author machenhui 
 */
xn("TestJSDOC",//模块名称
		["xn.lang.Class"],//依赖包关系
		function(Class){
	/**
	 * 方法体内容，并返回一个对象
	 * @constructor
	 */
	var testObject=Class.create({
		/**
		 * @constructor
		 */
		_init:function(){
			alert("testmessage");
		},
		/**
		 * @const
		 * @type {string}
		 */
		MY_CONST:"test",
        /**  
         * @description 私有属性 
         * @private 
         */
        _myPrivateProperty: "",
        /**
         * @description 共有属性
         * @public
         */
        myPublicProperty:"",
        /** 
         * @public
         * @description 共有方法 here
         * 
         */
        myPublicMethod: function () {
        }
});
	
	

    
    return  testObject;
	
});
