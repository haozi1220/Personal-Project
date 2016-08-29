var tools = {
	$ : function(selector,context){
		var firstChar = selector.charAt(0);
		context = context || document;
		if( firstChar === "#" ){
			return document.getElementById(selector.substring(1));
		}else if(firstChar === "."){
			return context.getElementsByClassName(selector.substring(1));
		}else{
			return context.getElementsByTagName(selector);
		}	
	},
	getStyle:function (obj,attr){
		if( obj.currentStyle ){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj)[attr];s
		}	
	},
	hasClass:function (element,classNames) {
		var classAll = 	element.className.split(" ");  //"blue red"
		for( var i = 0; i < classAll.length; i++ ){
			if( classAll[i] === classNames ){
				return true;
			}
		}
		return false;
	},
	removeClass:function (element,classNames){
		if( tools.hasClass(element,classNames) ){  //如果有这个class，就删除
			var classAll = element.className.split(" "); // ["blue","red"]
			for( var i = 0; i < classAll.length; i++ ){
				if( classAll[i] === classNames ){
					classAll.splice(i,1);
					i--;
				}
			}
			//如果这个数组为kong，那么就删除标签上的class这个属性
			if( classAll.length === 0 ){
				element.removeAttribute("class");
			}else{
				element.className = classAll.join(" ");
			}
			

		}
	},
	addClass:function (element,classNames){
		var classAll = element.className;  // ""    "blue"
		if( !tools.hasClass(element,classNames) ){
			classAll += " " + classNames;
		}
		element.className = classAll.trim();

	},
	/***************************切换class******************************/
	toggleClass:function (element,classNames){
		if( tools.hasClass(element,classNames) ){
			tools.removeClass(element,classNames);
			return false;
		}else{
			tools.addClass(element,classNames);
			return true;
		}	
	},
	getRect:function(obj){
		return obj.getBoundingClientRect();//实时获取元素宽，高，等信息；
	}
}



/*
	参数：
		element:给这个元素绑定鼠标滚轮事件
		upFn：向上触发的函数
		downFn:向下触发的函数
*/
function mouseWheel(element,upFn,downFn){
	element.onmousewheel = fn;
	function fn(ev){
		var direction = true;
		if(ev.wheelDelta){
			direction = ev.wheelDelta < 0 ? true:false;
		}else if(ev.detail){
			direction = ev.detail < 0 ? false:true;
		}
		
		if(element.addEventListener){
			element.addEventListener("DOMMouseScroll",fn,false);
		}
		if( !direction ){  //向上
			typeof upFn === "function" && upFn.call(element,ev);
		}else{  //向下
			typeof downFn === "function" && downFn.call(element,ev);
		}
		
		ev.preventDefault();

	}
}



/*
	参数：
		obj1:碰撞的元素
		obj2：被碰撞的元素
*/

function duang(obj1,obj2){
	var obj1Info = tools.getRect(obj1);	
	var obj2Info = tools.getRect(obj2);	

	//obj1的上下左右

	var obj1L = obj1Info.left;
	var obj1R = obj1Info.right;
	var obj1T = obj1Info.top;
	var obj1B = obj1Info.bottom;

	//obj2的上下左右
	var obj2L = obj2Info.left;
	var obj2R = obj2Info.right;
	var obj2T = obj2Info.top;
	var obj2B = obj2Info.bottom;

	//排除掉没碰上的区域

	if( obj1R < obj2L || obj1L > obj2R || obj1B < obj2T || obj1T > obj2B){
		return false;
	}else{
		return true;
	}
}