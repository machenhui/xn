xn.create("core-beta.Class",["loader_test.A","loader_test.B"],function(A,B){
	var Class=function(){
		this._init.apply(this,arguments);
		
		
	};
	
	Class.prototype =Object.create(Class.prototype,{
		a:{value:A.name,writable: false,enumerable:true,configurable: true},
		b:{value:B.name,writable: false,enumerable:true,configurable: true}
	});
	Class.prototype._init=function(){
		//alert(this.a);
	};
	
	return Class;
});